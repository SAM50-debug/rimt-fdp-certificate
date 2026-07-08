import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CERTIFICATE, extractSerialSuffix } from '../constants/certificate';
import { downloadCertificate, type FacultyRecord } from '../services/excel';

export default function Preview() {
  const { employeeCode } = useParams<{ employeeCode: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<FacultyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchEmployee() {
      if (!employeeCode) return;
      try {
        const response = await fetch('/api/find-employee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeCode }),
        });
        if (response.status === 404) {
          setError('Employee not found');
          return;
        }
        if (!response.ok) throw new Error('Failed to load');
        const data = await response.json();
        setEmployee(data);
      } catch {
        setError('Error loading employee data');
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [employeeCode]);

  const handleDownload = async () => {
    if (!employeeCode) return;
    setDownloading(true);
    try {
      await downloadCertificate(employeeCode);
    } catch {
      alert('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !employee) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  const serialNo = String(employee['Serial No']);

  // Note: PDF coordinates are from the bottom-left. 
  // CSS absolute positioning (bottom/left) matches this perfectly.
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 pb-12 sm:pt-24 px-4 font-sans text-slate-800">

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-4xl justify-between items-center bg-white p-5 sm:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] disabled:hover:-translate-y-0"
        >
          {downloading ? (
            <>
              <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </>
          ) : (
            <>
              Download Certificate
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </>
          )}
        </button>
      </div>

      {/* Certificate Wrapper for responsiveness on smaller screens */}
      <div className="w-full overflow-x-auto pb-8 flex justify-center custom-scrollbar">

        <div className="relative shadow-2xl" style={{ width: `${CERTIFICATE.PREVIEW_WIDTH}px`, height: `${CERTIFICATE.PREVIEW_HEIGHT}px`, backgroundColor: 'white' }}>
          <img
            src="/certificate-template.png"
            alt="Certificate Template"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Name */}
          <div
            className="absolute font-bold whitespace-nowrap"
            style={{
              fontFamily: '"Canva Sans", sans-serif',
              fontSize: `${CERTIFICATE.NAME_SIZE}px`,
              color: CERTIFICATE.NAME_COLOR,
              left: `${CERTIFICATE.NAME_X}px`,
              bottom: `${CERTIFICATE.NAME_Y}px`,
              transform: 'translateX(-50%)', // center it based on NAME_X
              lineHeight: 1
            }}
          >
            {String(employee['Name']).toUpperCase()}
          </div>

          {/* Serial Number Suffix */}
          <div
            className="absolute font-bold whitespace-nowrap"
            style={{
              fontFamily: '"TT Squares", sans-serif',
              fontSize: `${CERTIFICATE.SERIAL_SUFFIX_SIZE}px`,
              color: CERTIFICATE.SERIAL_SUFFIX_COLOR,
              left: `${CERTIFICATE.SERIAL_SUFFIX_X}px`,
              bottom: `${CERTIFICATE.SERIAL_SUFFIX_Y}px`,
              transform: `rotate(${CERTIFICATE.SERIAL_SUFFIX_ROTATION}deg)`,
              transformOrigin: 'left bottom',
              lineHeight: 1,
            }}
          >
            {extractSerialSuffix(serialNo)}
          </div>

          {/* QR Code Placeholder */}
          <div
            className="absolute bg-white p-1"
            style={{
              left: `${CERTIFICATE.QR_X}px`,
              bottom: `${CERTIFICATE.QR_Y}px`,
              width: `${CERTIFICATE.QR_SIZE}px`,
              height: `${CERTIFICATE.QR_SIZE}px`
            }}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://fdprimt.vercel.app/verify/${employee['Serial No']}`)}`}
              alt="QR Code"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
