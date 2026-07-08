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
      } catch (err) {
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
    } catch (err) {
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-12 px-4">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
        >
          Back
        </button>
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="px-6 py-2.5 bg-[#C62828] text-white font-medium rounded-lg hover:bg-[#A91E1E] transition-colors disabled:opacity-50"
        >
          {downloading ? 'Downloading...' : 'Download Certificate'}
        </button>
      </div>

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
  );
}
