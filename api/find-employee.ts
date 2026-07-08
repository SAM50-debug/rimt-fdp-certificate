import type { VercelRequest, VercelResponse } from '@vercel/node';
import { findEmployee } from './lib/faculty.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { employeeCode } = req.body as { employeeCode?: string };
  if (!employeeCode || !employeeCode.trim()) {
    return res.status(400).json({ error: 'Employee code is required' });
  }

  try {
    const match = findEmployee(employeeCode);

    if (!match) {
      return res.status(404).json({ error: 'Employee code not found.' });
    }

    return res.status(200).json(match);
  } catch {
    return res.status(500).json({ error: 'Failed to load faculty data.' });
  }
}
