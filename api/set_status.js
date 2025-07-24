import { currentStatus } from './get_status';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  let body = '';
  for await (const chunk of req) body += chunk;
  const data = JSON.parse(body);

  if (!data.status) {
    return res.status(400).json({ message: 'Missing status' });
  }

  currentStatus = data.status;

  res.status(200).json({ message: Status updated to  });
}
