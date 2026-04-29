export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { contactName, company, optionName, price } = body;

  if (!contactName || !company || !optionName || !price) {
    return json({ error: 'Missing required fields' }, 400);
  }

  const invoiceRes = await fetch('https://api.invoiless.com/v1/invoices', {
    method: 'POST',
    headers: {
      'api-key': env.INVOILESS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'Draft',
      customer: {
        billTo: {
          name: contactName,
          company: company,
        },
      },
      items: [
        {
          name: optionName,
          quantity: 1,
          price: price,
        },
      ],
    }),
  });

  if (!invoiceRes.ok) {
    const err = await invoiceRes.text();
    console.error('Invoiless error:', err);
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
