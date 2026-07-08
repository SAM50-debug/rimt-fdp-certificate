import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findEmployeeBySerialNo, type FacultyRecord } from '../services/excel';

export default function Verify() {
  const { serialNo } = useParams<{ serialNo: string }>();
  const [employee, setEmployee] = useState<FacultyRecord | null>(null);
  const [loading, setLoading] = useState(!!serialNo);
  const [error, setError] = useState(serialNo ? '' : 'Invalid URL: Missing certificate serial number.');

  useEffect(() => {
    if (!serialNo) {
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-800 p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-8 sm:p-12 max-w-lg w-full relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-rose-500" />

        {loading ? (
          <div className="text-center py-10 flex flex-col items-center justify-center">
            <svg className="animate-spin mb-4 h-10 w-10 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-xl font-bold text-slate-600">Verifying Certificate...</h2>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
              <span className="text-5xl">❌</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Verification Failed</h2>
            <p className="text-slate-600 font-medium text-lg leading-relaxed">{error}</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6 shadow-sm border border-green-100">
              <span className="text-5xl">✅</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Certificate Verified</h1>

            <div className="space-y-6 text-left bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1.5">Name</p>
                <p className="text-lg font-bold text-slate-900">{employee?.Name}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1.5">Employee Code</p>
                <p className="text-lg font-bold text-slate-900">{employee?.['Employee Code']}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1.5">Certificate Number</p>
                <p className="text-lg font-bold text-slate-900 font-mono tracking-tight bg-slate-200/50 inline-block px-2 py-0.5 rounded-md">{employee?.['Serial No']}</p>
              </div>

              <div className="pt-5 border-t border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1.5">Faculty Development Programme</p>
                <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 leading-tight">
                  Interactive AI with Raspberry Pi
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
