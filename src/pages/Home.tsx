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
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navbar */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center sm:justify-between items-center gap-6">
          <div className="flex items-center gap-6 md:gap-12 justify-center w-full sm:w-auto">
            <img src={rimtLogo} alt="RIMT University" className="h-10 md:h-12 object-contain" />
            <img src={iicLogo} alt="IIC" className="h-10 md:h-12 object-contain" />
            <img src={innow8Logo} alt="INNOW8" className="h-10 md:h-12 object-contain" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full max-w-6xl mx-auto">

          {/* Left Text Column */}
          <div className="w-full max-w-xl mx-auto lg:ml-auto lg:mr-0 text-center lg:text-left space-y-8">
            <div className="inline-block bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border border-red-100 shadow-sm">
              Faculty Development Programme
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Interactive AI <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
                with Raspberry Pi
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Access your digitally verified participation certificate. Enter your employee code below to preview and download your credential.
            </p>

            <div className="hidden lg:flex items-center gap-3 text-sm font-medium text-slate-500 bg-white border border-slate-200 py-2.5 px-4 rounded-xl w-fit shadow-sm">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Digitally Verifiable via Embedded QR Code
            </div>
          </div>

          {/* Right Form Column */}
          <div className="w-full max-w-md mx-auto lg:mr-auto lg:ml-0">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Retrieve Certificate</h2>

              <div className="space-y-5">
                <div>
                  <label htmlFor="employeeCode" className="block text-sm font-bold text-slate-700 mb-2">
                    Employee Code
                  </label>
                  <input
                    id="employeeCode"
                    type="text"
                    value={employeeCode}
                    onChange={(e) => { setEmployeeCode(e.target.value); setError(''); }}
                    disabled={loading}
                    autoComplete="off"
                    placeholder="e.g. RIMT001245"
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition-colors duration-200"
                  />
                  {error && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-red-600 text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {error}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !employeeCode.trim()}
                  className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] disabled:hover:-translate-y-0"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Preview Certificate
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 flex lg:hidden items-center justify-center gap-2.5 text-xs font-medium text-slate-500 bg-white border border-slate-200 py-2.5 px-4 rounded-xl shadow-sm">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Digitally Verifiable via Embedded QR Code
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center space-y-1">
          <p className="text-sm font-bold text-slate-700">Department of Research & Innovation</p>
          <p className="text-xs font-medium text-slate-500">RIMT University &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
