import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rimtLogo from '../assets/logos/rimt.png';
import iicLogo from '../assets/logos/iic.png';
import innow8Logo from '../assets/logos/innow8.png';
import { findEmployee } from '../services/excel';

export default function Home() {
  const navigate = useNavigate();
  const [employeeCode, setEmployeeCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    const code = employeeCode.trim();
    if (!code) return;

    setError('');
    setLoading(true);
    try {
      const employee = await findEmployee(code);
      if (employee) {
        navigate(`/preview/${code}`);
      } else {
        setError('Employee code not found.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      {/* Top Navbar */}
      <nav className="w-full py-6 px-4 flex justify-center items-center gap-8 md:gap-16 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-8 md:gap-16">
          <img src={rimtLogo} alt="RIMT University Logo" className="h-12 w-32 object-contain" />
          <img src={iicLogo} alt="Institution's Innovation Council Logo" className="h-12 w-32 object-contain" />
          <img src={innow8Logo} alt="INNOW8 Logo" className="h-12 w-32 object-contain" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2D5175]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-12 transform transition-all duration-700 translate-y-0 opacity-100">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2D5175] mb-4 tracking-tight leading-tight">
            Interactive AI with Raspberry Pi
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-[#C62828] mb-6">
            Faculty Development Programme
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Enter your employee code to securely download your participation certificate.
          </p>
        </div>

        {/* Card Section */}
        <div className="w-full max-w-md bg-white backdrop-blur-xl rounded-4xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] relative z-10">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-2.5 relative group">
              <label htmlFor="employeeCode" className="text-sm font-semibold text-slate-700 ml-1">
                Employee Code
              </label>
              <input
                id="employeeCode"
                type="text"
                value={employeeCode}
                onChange={(e) => { setEmployeeCode(e.target.value); setError(''); }}
                disabled={loading}
                autoComplete="off"
                aria-label="Employee Code"
                placeholder="Enter Employee Code"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2D5175] focus:bg-white transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {error && (
                <p className="text-sm text-[#C62828] font-medium mt-1 ml-1">{error}</p>
              )}
            </div>
            <button 
              onClick={handleGenerate}
              disabled={loading || !employeeCode.trim()}
              className="w-full py-4 px-6 bg-[#C62828] hover:bg-[#A91E1E] text-white font-semibold rounded-2xl shadow-md shadow-[#C62828]/20 transition-all duration-300 active:scale-[0.98] hover:shadow-lg hover:shadow-[#C62828]/30 flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:shadow-md"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Preview Certificate</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Trust Badge */}
        <p className="mt-10 text-sm font-medium text-slate-500 text-center flex items-center justify-center gap-2.5 bg-white/60 px-5 py-2.5 rounded-full border border-slate-200/60 shadow-sm">
          <svg className="w-4 h-4 text-[#FF751F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          Your certificate is digitally verifiable using the embedded QR Code.
        </p>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-slate-100 bg-white/80 mt-auto">
        <p className="text-base font-semibold text-slate-800">Department of Research & Innovation</p>
        <p className="text-sm font-medium text-slate-500 mt-1.5">RIMT University</p>
      </footer>
    </div>
  );
}
