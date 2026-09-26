import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, Lock, Mail, AlertCircle, Compass, CheckCircle2 } from 'lucide-react';

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
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F33] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Institutional Header Branding */}
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="p-3 bg-[#2F6F95] rounded-xl shadow-lg border border-cyan-400/20">
            <Compass className="w-8 h-8 text-white animate-spin-slow" />
          </div>
        </div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#2F6F95] mb-1">
          Ministry of Earth Sciences (MoES) / NCPOR
        </h2>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          PolarOps Command Center
        </h1>
        <p className="text-sm text-slate-400">
          Indian Polar Expedition Operational & Asset Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-[#12283E] py-8 px-6 shadow-2xl rounded-xl border border-slate-700/60 sm:px-10">
          
          {localError && (
            <div className="mb-6 p-4 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>{localError}</div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">
                Official Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@polarops.gov.in"
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0B1F33] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2F6F95] focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0B1F33] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2F6F95] focus:border-transparent text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#2F6F95] hover:bg-[#245978] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F6F95] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="mt-8 pt-6 border-t border-slate-700/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Quick Role Selection (Demo Accounts)
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleQuickSelect(account.email)}
                  className={`p-2.5 rounded-lg border text-left transition-all hover:bg-slate-800/80 ${account.color} ${email === account.email ? 'ring-2 ring-[#2F6F95]' : ''}`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
                    <span>{account.title}</span>
                    {email === account.email && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <div className="text-[11px] opacity-80 truncate">{account.name}</div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-center text-slate-500">
              Demo Password: <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">polarops2026</code>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
