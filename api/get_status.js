let currentStatus = 'Offline';

export default function handler(req, res) {
  res.status(200).json({ status: currentStatus });
}

// Export for sharing
export const statusStore = { currentStatus };
