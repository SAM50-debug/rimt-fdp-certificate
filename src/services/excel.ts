export interface FacultyRecord {
  'Employee Code': string | number;
  'Name': string;
  'Serial No': string;
}

export async function findEmployee(employeeCode: string): Promise<FacultyRecord | null> {
  const response = await fetch('/api/find-employee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeCode }),
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Server error');
  }

  return response.json() as Promise<FacultyRecord>;
}

export async function findEmployeeBySerialNo(serialNo: string): Promise<FacultyRecord | null> {
  const response = await fetch('/api/find-employee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serialNo }),
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Server error');
  }

  return response.json() as Promise<FacultyRecord>;
}

export async function downloadCertificate(employeeCode: string): Promise<void> {
  const response = await fetch('/api/generate-certificate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeCode }),
  });

  if (response.status === 404) {
    throw new Error('Employee code not found.');
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Certificate generation failed.');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;

  const disposition = response.headers.get('Content-Disposition');
  const filename = disposition?.match(/filename="(.+)"/)?.[1] ?? 'certificate.pdf';
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
