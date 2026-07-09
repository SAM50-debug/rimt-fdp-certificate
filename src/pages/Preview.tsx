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
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    async function fetchEmployee() {
      if (!employeeCode) {
        setError('Employee code missing');
        setLoading(false);
        return;
      }

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

  useEffect(() => {
    const updateScale = () => {
      const sidePadding = 32;
      const availableWidth = window.innerWidth - sidePadding;
      const scale = Math.min(1, availableWidth / CERTIFICATE.PREVIEW_WIDTH);

      setPreviewScale(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => window.removeEventListener('resize', updateScale);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const serialNo = String(employee['Serial No']);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-6 sm:py-8 font-sans text-slate-800">
      {/* Action Bar */}
      <div
        className="relative z-20 mb-6 flex w-full justify-center"
        style={{
          maxWidth: `${CERTIFICATE.PREVIEW_WIDTH}px`,
        }}
      >
        <div
          className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{
            width: `${CERTIFICATE.PREVIEW_WIDTH * previewScale}px`,
            maxWidth: '100%',
          }}
        >
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] disabled:hover:-translate-y-0"
          >
            {downloading ? (
              <>
                <svg
                  className="animate-spin -ml-1 h-5 w-5 text-white"
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
                Downloading...
              </>
            ) : (
              <>
                Download Certificate
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Certificate Wrapper */}
      <div className="relative z-10 w-full pb-8 flex justify-center">
        <div
          className="relative"
          style={{
            width: `${CERTIFICATE.PREVIEW_WIDTH * previewScale}px`,
            height: `${CERTIFICATE.PREVIEW_HEIGHT * previewScale}px`,
          }}
        >
          <div
            className="relative shadow-2xl origin-top-left"
            style={{
              width: `${CERTIFICATE.PREVIEW_WIDTH}px`,
              height: `${CERTIFICATE.PREVIEW_HEIGHT}px`,
              backgroundColor: 'white',
              transform: `scale(${previewScale})`,
              transformOrigin: 'top left',
            }}
          >
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
                // transform: 'translateX(-50%)',
                lineHeight: 1,
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
                height: `${CERTIFICATE.QR_SIZE}px`,
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                  `https://fdprimt.vercel.app/verify/${employee['Serial No']}`
                )}`}
                alt="QR Code"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}