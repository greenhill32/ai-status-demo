let currentStatus = 'Offline';

export default function handler(req, res) {
  res.status(200).json({ status: currentStatus });
}

export { currentStatus };
