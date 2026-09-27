import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import polaropsLoginLogo from '../assets/polarops-login-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const demoAccounts = [
    {
      role: 'ADMIN',
      title: 'Administrator',
      email: 'admin@polarops.gov.in',
      name: 'Dr. Sunita Sharma',
      color: 'bg-purple-900/30 text-purple-300 border-purple-700/50'
    },
    {
      role: 'EXPEDITION_MANAGER',
      title: 'Expedition Manager',
      email: 'manager@polarops.gov.in',
      name: 'Rajesh Rao',
      color: 'bg-blue-900/30 text-blue-300 border-blue-700/50'
    },
    {
      role: 'FIELD_OFFICER',
      title: 'Field Officer',
      email: 'officer@polarops.gov.in',
      name: 'Vikramaditya Singh',
      color: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50'
    },
    {
      role: 'EMERGENCY_COORDINATOR',
      title: 'Emergency Coordinator',
      email: 'emergency@polarops.gov.in',
      name: 'Dr. Ananya Sen',
      color: 'bg-rose-900/30 text-rose-300 border-rose-700/50'
    }
  ];

  const handleQuickSelect = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('polarops2026');
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setLocalError('');

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-[#0B1F33] flex flex-col justify-center items-center px-4 py-3 overflow-hidden text-slate-100 select-none">
      <div className="w-full max-w-md mx-auto my-auto flex flex-col justify-center">
        
        {/* Institutional Header Branding */}
        <div className="text-center mb-3">
          <div className="flex justify-center items-center mb-2">
            <img
              src={polaropsLoginLogo}
              alt="PolarOps Official Logo"
              className="h-20 sm:h-24 w-auto max-w-full object-contain"
            />
          </div>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#2F6F95] mb-0.5">
            Ministry of Earth Sciences (MoES) / NCPOR
          </h2>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-0.5">
            PolarOps Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Indian Polar Expedition Operational & Asset Management System
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-[#12283E] py-5 px-5 sm:px-8 shadow-xl rounded-xl border border-slate-700/60 w-full">
          
          {localError && (
            <div className="mb-3 p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>{localError}</div>
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-1">
                Official Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@polarops.gov.in"
                  className="block w-full pl-9 pr-3 py-2 bg-[#0B1F33] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2F6F95] focus:border-transparent text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 bg-[#0B1F33] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2F6F95] focus:border-transparent text-xs sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#2F6F95] hover:bg-[#245978] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F6F95] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Secure Command Center Access
                </span>
              )}
            </button>
          </form>

          {/* Quick Role Selection for Demonstration */}
          <div className="mt-4 pt-3 border-t border-slate-700/80">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 text-center">
              Quick Role Selection (Demo Accounts)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleQuickSelect(account.email)}
                  className={`p-2 rounded-lg border text-left transition-all hover:bg-slate-800/80 ${account.color} ${email === account.email ? 'ring-2 ring-[#2F6F95]' : ''}`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
                    <span className="truncate">{account.title}</span>
                    {email === account.email && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
                  </div>
                  <div className="text-[10px] opacity-80 truncate">{account.name}</div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-center text-slate-500">
              Demo Password: <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">polarops2026</code>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
