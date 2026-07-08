import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findEmployeeBySerialNo, type FacultyRecord } from '../services/excel';

export default function Verify() {
  const { serialNo } = useParams<{ serialNo: string }>();
  const [employee, setEmployee] = useState<FacultyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!serialNo) {
      setError('Invalid URL: Missing certificate serial number.');
      setLoading(false);
      return;
    }

    findEmployeeBySerialNo(serialNo)
      .then(data => {
        if (data) {
          setEmployee(data);
        } else {
          setError('Certificate not found. Please check the serial number.');
        }
      })
      .catch(() => {
        setError('Error verifying certificate. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serialNo]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-slate-800 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full">
        {loading ? (
          <div className="text-center">
            <h2 className="text-xl font-medium animate-pulse text-slate-500">Verifying Certificate...</h2>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-slate-600">{error}</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Certificate Verified</h1>

            <div className="space-y-6 text-left">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Name</p>
                <p className="text-xl font-medium text-slate-800">{employee?.Name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Employee Code</p>
                <p className="text-xl font-medium text-slate-800">{employee?.['Employee Code']}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Certificate Number</p>
                <p className="text-xl font-medium text-slate-800 font-mono">{employee?.['Serial No']}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Faculty Development Programme</p>
                <p className="text-lg font-medium text-indigo-700">Interactive AI with Raspberry Pi</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
