import * as XLSX from 'xlsx';
import path from 'node:path';
import fs from 'node:fs';

export interface FacultyRecord {
  'Employee Code': string | number;
  'Name': string;
  'Serial No': string;
}

let cachedData: FacultyRecord[] | null = null;

export function loadFacultyData(): FacultyRecord[] {
  if (cachedData) return cachedData;

  const filePath = path.join(process.cwd(), 'data', 'faculty.xlsx');
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  cachedData = XLSX.utils.sheet_to_json<FacultyRecord>(firstSheet, { defval: '' });
  return cachedData;
}

export function findEmployee(employeeCode: string): FacultyRecord | null {
  const trimmed = employeeCode.trim().toLowerCase();
  if (!trimmed) return null;

  const rows = loadFacultyData();
  const match = rows.find(
    (row) => String(row['Employee Code']).trim().toLowerCase() === trimmed
  );

  return match ?? null;
}

export function findBySerialNo(serialNo: string): FacultyRecord | null {
  const trimmed = serialNo.trim().toLowerCase();
  if (!trimmed) return null;

  const rows = loadFacultyData();
  const match = rows.find(
    (row) => String(row['Serial No']).trim().toLowerCase() === trimmed
  );

  return match ?? null;
}
