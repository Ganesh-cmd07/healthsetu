
import React, { useState } from 'react';
import { ShieldCheck, Loader2, Mail, Lock, AlertCircle, ArrowRight, Activity, Zap, Heart, Globe } from 'lucide-react';
import { HealthLayer } from '../types';

interface SignInPortalProps {
  onLoginSuccess: (role: HealthLayer | 'DASHBOARD', email: string) => void;
}

const users: Record<string, { pass: string, role: HealthLayer | 'DASHBOARD' }> = {
  "patient@demo.com": { pass: "1234", role: HealthLayer.PATIENT_GUARDIAN },
  "woman@demo.com":   { pass: "1234", role: HealthLayer.FEM_SYNC },
  "admin@hospital.com": { pass: "1234", role: HealthLayer.SMART_HOSPITAL },
  "gov@india.in":     { pass: "1234", role: HealthLayer.NATIONAL_GRID },
  "demo@healthsetu.com": { pass: "1234", role: "DASHBOARD" }
};

const SignInPortal: React.FC<SignInPortalProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter credentials");
      triggerShake();
      return;
    }

    const lowerEmail = email.toLowerCase();
    const user = users[lowerEmail];

    if (user && user.pass === password) {
      setIsAuthenticating(true);
      
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onLoginSuccess(user.role, lowerEmail);
        }, 500);
      }, 1500);
    } else {
      setError("Invalid Email or Password");
      triggerShake();
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className={`fixed inset-0 z-[500] flex bg-white transition-opacity duration-500 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Left Panel: Brand & Vision (Visible on Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 relative overflow-hidden items-center justify-center p-16">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full -mr-64 -mt-64 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full -ml-64 -mb-64 blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[32px] shadow-2xl mb-12 transform -rotate-3 transition-transform hover:rotate-0">
            <ShieldCheck className="text-indigo-600 w-12 h-12" />
          </div>
          <h2 className="text-6xl font-black text-white leading-tight tracking-tighter mb-8">
            The AI Healthcare <span className="text-indigo-300 italic">Grid</span> for India.
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl"><Zap className="text-amber-400 w-6 h-6" /></div>
              <div>
                <h4 className="text-xl font-bold text-white">Smart Diagnostics</h4>
                <p className="text-indigo-200">AI-powered prescription decoding and interaction radar for safer medication.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl"><Heart className="text-rose-400 w-6 h-6" /></div>
              <div>
                <h4 className="text-xl font-bold text-white">Fem-Sync Care</h4>
                <p className="text-indigo-200">Personalized hormonal tracking and predictive migraine analysis for women.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl"><Globe className="text-emerald-400 w-6 h-6" /></div>
              <div>
                <h4 className="text-xl font-bold text-white">National Safety</h4>
                <p className="text-indigo-200">A connected grid for real-time drug safety monitoring across the country.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-indigo-600 w-6 h-6" />
            <span className="font-black text-xl text-slate-900 tracking-tighter">Health-Setu</span>
          </div>
        </div>

        <div className={`w-full max-w-md transition-transform duration-500 ${isShaking ? 'animate-shake' : ''}`}>
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Portal Sign-In</h1>
            <p className="text-slate-500 font-medium">Please enter your credentials to access the grid.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  id="login-email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-slate-50 lg:bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  id="login-pass"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 lg:bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            {error && (
              <div id="login-error" className="flex items-center space-x-2 text-rose-600 bg-rose-50 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 border border-rose-100">
                <AlertCircle size={18} />
                <span className="text-sm font-bold">{error}</span>
              </div>
            )}

            <button 
              id="login-btn"
              type="submit"
              disabled={isAuthenticating}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 shadow-xl ${
                isAuthenticating 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]'
              }`}
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Initialize Connection</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Grid */}
          <div className="mt-12">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
              <span className="h-[1px] flex-grow bg-slate-100 mr-4"></span>
              Demo Access Roles
              <span className="h-[1px] flex-grow bg-slate-100 ml-4"></span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => { setEmail('patient@demo.com'); setPassword('1234'); }}
                className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
              >
                <ShieldCheck size={20} className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-slate-600 uppercase">Patient</span>
              </button>
              <button 
                onClick={() => { setEmail('woman@demo.com'); setPassword('1234'); }}
                className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-rose-200 hover:bg-rose-50 transition-all group"
              >
                <Heart size={20} className="text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-slate-600 uppercase">Fem-Sync</span>
              </button>
              <button 
                onClick={() => { setEmail('admin@hospital.com'); setPassword('1234'); }}
                className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all group"
              >
                <Activity size={20} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-slate-600 uppercase">Hospital</span>
              </button>
              <button 
                onClick={() => { setEmail('gov@india.in'); setPassword('1234'); }}
                className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-purple-200 hover:bg-purple-50 transition-all group"
              >
                <Globe size={20} className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-slate-600 uppercase">Gov Grid</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPortal;
