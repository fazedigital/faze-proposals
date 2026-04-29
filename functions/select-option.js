export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { contactName, company, email, phone, optionName, price } = body;

  if (!contactName || !company || !email || !optionName || !price) {
    return json({ error: 'Missing required fields' }, 400);
  }

  const headers = {
    'api-key': env.INVOILESS_API_KEY,
    'Content-Type': 'application/json',
  };

  // Step 1 — create or find the customer
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
    return json({ error: 'Failed to create customer', detail: err, status: customerRes.status }, 500);
  }

  const customer = await customerRes.json();

  // Step 2 — create the draft invoice linked to that customer
  const invoiceRes = await fetch('https://api.invoiless.com/v1/invoices', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      status: 'Draft',
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

  return json({ success: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
