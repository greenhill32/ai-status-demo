let currentStatus = 'Offline';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: currentStatus });
  }

  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const data = JSON.parse(body);

    if (!data.status) {
      return res.status(400).json({ message: 'Missing status' });
    }

    currentStatus = data.status;
    return res.status(200).json({ message: `Status updated to ${data.status}` });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
