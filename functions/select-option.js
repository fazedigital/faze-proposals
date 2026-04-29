export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  // GET — check if this proposal already has a selection
  if (method === 'GET') {
    const slug = new URL(request.url).searchParams.get('slug');
    if (!slug) return json({ error: 'Missing slug' }, 400);

    const selection = await env.PROPOSALS_KV.get(slug);
    return json({ selected: selection ?? null });
  }

  // POST — submit a selection
  if (method === 'POST') {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid request body' }, 400);
    }

    const { slug, contactName, company, email, phone, optionName, price } = body;

    if (!slug || !contactName || !company || !email || !optionName || !price) {
      return json({ error: 'Missing required fields' }, 400);
    }

    // Check if already selected — server-side guard
    const existing = await env.PROPOSALS_KV.get(slug);
    if (existing) {
      return json({ error: 'Already selected', selected: existing }, 409);
    }

    const headers = {
      'api-key': env.INVOILESS_API_KEY,
      'Content-Type': 'application/json',
    };

    // Create customer
    const customerRes = await fetch('https://api.invoiless.com/v1/customers', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        billTo: {
          company,
          firstName: contactName.split(' ')[0],
          lastName:  contactName.split(' ').slice(1).join(' ') || '',
          email,
          phone: phone || '',
        },
      }),
    });

    if (!customerRes.ok) {
      const err = await customerRes.text();
      console.error('Invoiless customer error:', err);
      return json({ error: 'Failed to create customer' }, 500);
    }

    const customer = await customerRes.json();

    // Create draft invoice
    const invoiceRes = await fetch('https://api.invoiless.com/v1/invoices', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        status:   'Draft',
        customer: customer.id,
        items: [
          {
            name:     optionName,
            quantity: 1,
            price:    price,
          },
        ],
      }),
    });

    if (!invoiceRes.ok) {
      const err = await invoiceRes.text();
      console.error('Invoiless invoice error:', err);
      return json({ error: 'Failed to create invoice' }, 500);
    }

    // Lock the proposal in KV
    await env.PROPOSALS_KV.put(slug, optionName);

    return json({ success: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
