import type { VercelRequest, VercelResponse } from '@vercel/node';
import { findEmployee, findBySerialNo } from './lib/faculty.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { employeeCode, serialNo } = req.body as { employeeCode?: string, serialNo?: string };
  if (!employeeCode?.trim() && !serialNo?.trim()) {
    return res.status(400).json({ error: 'Employee code or serial number is required' });
  }

  try {
    let match = null;
    if (serialNo?.trim()) {
      match = findBySerialNo(serialNo);
    } else if (employeeCode?.trim()) {
      match = findEmployee(employeeCode);
    }

    if (!match) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    return res.status(200).json(match);
  } catch {
    return res.status(500).json({ error: 'Failed to load faculty data.' });
  }
}
