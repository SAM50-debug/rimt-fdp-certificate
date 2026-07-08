import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findEmployeeBySerialNo, type FacultyRecord } from '../services/excel';

export default function Verify() {
  const { serialNo } = useParams<{ serialNo: string }>();
  const [employee, setEmployee] = useState<FacultyRecord | null>(null);
  const [loading, setLoading] = useState(!!serialNo);
  const [error, setError] = useState(
    serialNo ? '' : 'Invalid URL: Missing certificate serial number.'
  );

  useEffect(() => {
    if (!serialNo) {
      return;
    }

    findEmployeeBySerialNo(serialNo)
      .then((data) => {
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-800 px-4 py-8 sm:p-6">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 px-4 py-6 sm:p-12 w-full max-w-[340px] sm:max-w-lg relative overflow-visible">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-rose-500 rounded-t-3xl" />

        {loading ? (
          <div className="text-center py-8 sm:py-10 flex flex-col items-center justify-center">
            <svg
              className="animate-spin mb-4 h-9 w-9 sm:h-10 sm:w-10 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>

            <h2 className="text-lg sm:text-xl font-bold text-slate-600">
              Verifying Certificate...
            </h2>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-red-50 mb-5 sm:mb-6">
              <span className="text-3xl sm:text-5xl">❌</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Verification Failed
            </h2>

            <p className="text-slate-600 font-medium text-base sm:text-lg leading-relaxed">
              {error}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-green-50 mb-4 sm:mb-6 shadow-sm border border-green-100">
              <span className="text-3xl sm:text-5xl">✅</span>
            </div>

            <h1 className="text-xl sm:text-4xl font-extrabold text-slate-900 mb-5 sm:mb-8 tracking-tight leading-tight">
              Certificate Verified
            </h1>

            <div className="space-y-4 sm:space-y-6 text-left bg-slate-50/50 px-3.5 py-4 sm:p-6 rounded-2xl border border-slate-100 min-w-0">
              <div>
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
                  Name
                </p>
                <p className="text-sm sm:text-lg font-bold text-slate-900 break-words leading-snug">
                  {employee?.Name}
                </p>
              </div>

              <div>
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
                  Employee Code
                </p>
                <p className="text-sm sm:text-lg font-bold text-slate-900 break-words leading-snug">
                  {employee?.['Employee Code']}
                </p>
              </div>

              <div>
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
                  Certificate Number
                </p>
                <p className="text-sm sm:text-lg font-bold text-slate-900 font-mono tracking-tight bg-slate-200/50 inline-block max-w-full px-2 py-1 rounded-md break-all leading-snug">
                  {employee?.['Serial No']}
                </p>
              </div>

              <div className="pt-4 sm:pt-5 border-t border-slate-200">
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
                  Faculty Development Programme
                </p>

                <p className="text-base sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 leading-snug break-words pb-1">
                  Interactive AI with Raspberry Pi
                </p>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-slate-200">
                <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-tight">
                  Verified by
                </p>
                <p className="text-sm sm:text-lg font-extrabold text-slate-900 leading-snug">
                  R.P Singh
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}