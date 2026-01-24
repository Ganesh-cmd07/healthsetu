
import React, { useState } from 'react';
import { 
  QrCode, User, Activity, Stethoscope, Siren, Bed, Clock, Sparkles, ChevronRight, Wind, CheckCircle, Download, FileText, ShieldCheck, Fingerprint, Key, Lock, Unlock, Loader2, ShieldAlert, AlertCircle, X, Check, RefreshCcw, Plus, Minus, Zap
} from 'lucide-react';
import { PatientRecord } from '../types';

const initialPatients: PatientRecord[] = [
  { id: '102', name: 'Stephan Bastian', symptoms: 'Severe Chest Pain', severity: 'RED', arrivalTime: '10:15 AM', history: 'Hypertension', allergies: 'Penicillin', bloodType: 'B-' },
  { id: '103', name: 'Sara Jones', symptoms: 'Breathlessness', severity: 'RED', arrivalTime: '10:18 AM', history: 'Asthma', allergies: 'Dust', bloodType: 'O+' },
];

const SmartHospital: React.FC = () => {
  const [patients] = useState<PatientRecord[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('102');
  const [toast, setToast] = useState<string | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Inventory State
  const [beds, setBeds] = useState(12);
  const [oxygen, setOxygen] = useState(45);
  
  // Authorization States
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authMethod, setAuthMethod] = useState<'FINGERPRINT' | 'PASSKEY' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isPasskeySet, setIsPasskeySet] = useState(false);

  // Passkey Creation Flow
  const [passkeyStep, setPasskeyStep] = useState<'IDLE' | 'CREATE' | 'CONFIRM'>('IDLE');
  const [passkeyBuffer, setPasskeyBuffer] = useState('');
  const [confirmBuffer, setConfirmBuffer] = useState('');

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleScan = () => {
    setIsPulsing(true);
    setToast("✅ Patient History Retrieved from ABHA ID");
    setTimeout(() => {
      setIsPulsing(false);
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  const startFingerprintAuth = () => {
    setAuthMethod('FINGERPRINT');
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsAuthorized(true);
      setToast("🔓 Biometric Access Granted.");
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  const handlePasskeyDigit = (digit: string) => {
    if (passkeyStep === 'CREATE') {
      if (passkeyBuffer.length < 4) setPasskeyBuffer(prev => prev + digit);
    } else if (passkeyStep === 'CONFIRM') {
      if (confirmBuffer.length < 4) setConfirmBuffer(prev => prev + digit);
    }
  };

  const handlePasskeyAction = () => {
    if (passkeyStep === 'CREATE' && passkeyBuffer.length === 4) {
      setPasskeyStep('CONFIRM');
    } else if (passkeyStep === 'CONFIRM' && confirmBuffer.length === 4) {
      if (passkeyBuffer === confirmBuffer) {
        setIsScanning(true);
        setTimeout(() => {
          setIsScanning(false);
          setIsAuthorized(true);
          setIsPasskeySet(true);
          setPasskeyStep('IDLE');
          setToast("🔓 Passkey Verified. Access Granted.");
          setTimeout(() => setToast(null), 3000);
        }, 1000);
      } else {
        setToast("❌ Mismatch. Resetting flow.");
        resetPasskeyFlow();
        setTimeout(() => setToast(null), 3000);
      }
    }
  };

  const resetPasskeyFlow = () => {
    setPasskeyStep('IDLE');
    setPasskeyBuffer('');
    setConfirmBuffer('');
  };

  const handleDownloadAudit = () => {
    if (!isAuthorized) return;
    setToast(`📥 Clinical Audit Log Exported.`);
    setTimeout(() => setToast(null), 3000);
  };

  const updateInventory = (type: 'BEDS' | 'OXYGEN', delta: number) => {
    if (!isAuthorized) {
      setToast("🔒 Authorization Required for Inventory Sync");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (type === 'BEDS') {
      setBeds(prev => Math.max(0, prev + delta));
    } else {
      setOxygen(prev => Math.max(0, prev + delta));
    }
    
    setToast(`Grid Sync: ${type} Updated`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen -m-4 md:-m-8 bg-white overflow-hidden relative font-sans">
      {toast && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[500] bg-slate-900 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top-4">
          {toast}
        </div>
      )}

      {/* Auth Scan Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[600] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mb-4 mx-auto">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {authMethod === 'FINGERPRINT' ? <Fingerprint size={24} className="text-indigo-400 animate-pulse" /> : <Key size={24} className="text-indigo-400 animate-pulse" />}
              </div>
            </div>
            <p className="text-indigo-400 font-black uppercase text-[8px] tracking-[0.3em] animate-pulse">Initializing Session</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden bg-white relative">
        <aside className="w-[28%] border-r border-slate-100 bg-white overflow-y-auto">
          <div className="p-4 border-b font-black text-[9px] text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 flex justify-between items-center sticky top-0 z-10">
            <span>Triage Queue</span>
            {isAuthorized && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
          </div>
          {patients.map(p => (
            <button 
              key={p.id} 
              onClick={() => setSelectedPatientId(p.id)}
              className={`w-full text-left p-6 border-b border-slate-50 border-l-4 transition-all ${
                selectedPatientId === p.id ? 'bg-slate-50 border-l-indigo-600' : 'border-l-transparent hover:bg-slate-50/30'
              }`}
            >
              <span className={`font-black text-xs tracking-tight block ${selectedPatientId === p.id ? 'text-indigo-600' : 'text-slate-800'}`}>
                {p.name}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verified Patient</span>
            </button>
          ))}
        </aside>

        <main className={`flex-1 overflow-y-auto p-12 transition-all pb-32`}>
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 italic">Clinical Case File</p>
              <h2 className="text-5xl font-black text-slate-950 tracking-tighter mb-4">{activePatient.name}</h2>
              <div className="flex items-center space-x-3">
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100">ABHA: HS-ID-{activePatient.id}</span>
                <span className="bg-slate-50 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-slate-100">Group: {activePatient.bloodType}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleDownloadAudit}
                className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center transition-all shadow-xl ${
                  isAuthorized ? 'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-50' : 'bg-slate-50 border-slate-100 text-slate-300'
                }`}
              >
                {isAuthorized ? <Download size={18} /> : <Lock size={18} />}
              </button>
              <button 
                onClick={handleScan}
                className={`px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 transition-all ${
                  isPulsing ? 'bg-emerald-600 animate-pulse text-white' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100'
                }`}
              >
                <QrCode size={16} />
                <span>Admission</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2 bg-slate-900 p-8 rounded-[32px] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
               <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] mb-3 flex items-center">
                 <Sparkles size={14} className="mr-3" /> AI Insight Engine
               </h4>
               <p className="text-xl font-bold text-white leading-relaxed tracking-tight">
                 Presenting: {activePatient.symptoms}. 
                 Alignment with {activePatient.history} records.
               </p>
            </div>

            {/* RESOURCE MANAGEMENT HUB */}
            <div className="col-span-2 bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] flex items-center">
                    <Activity size={14} className="mr-3 text-indigo-500" /> Resource Management Hub
                  </h4>
                  {!isAuthorized && (
                    <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                      <Lock size={10} className="text-slate-400" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Authorization Required</span>
                    </div>
                  )}
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Beds Control */}
                  <div className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-all hover:border-indigo-200">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
                        <Bed size={24} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Beds</p>
                        <h5 className="text-3xl font-black text-slate-900 tabular-nums">
                          {isAuthorized ? beds : '--'}
                        </h5>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 ${!isAuthorized ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}>
                      <button 
                        onClick={() => updateInventory('BEDS', -1)} 
                        disabled={!isAuthorized}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all shadow-sm"
                      >
                        <Minus size={16} className="text-slate-600" />
                      </button>
                      <button 
                        onClick={() => updateInventory('BEDS', 1)}
                        disabled={!isAuthorized}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all shadow-sm"
                      >
                        <Plus size={16} className="text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Oxygen Control */}
                  <div className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-all hover:border-emerald-200">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
                        <Wind size={24} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">O2 Cylinders</p>
                        <h5 className="text-3xl font-black text-slate-900 tabular-nums">
                          {isAuthorized ? oxygen : '--'}
                        </h5>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 ${!isAuthorized ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}>
                      <button 
                        onClick={() => updateInventory('OXYGEN', -1)}
                        disabled={!isAuthorized}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all shadow-sm"
                      >
                        <Minus size={16} className="text-slate-600" />
                      </button>
                      <button 
                        onClick={() => updateInventory('OXYGEN', 1)}
                        disabled={!isAuthorized}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all shadow-sm"
                      >
                        <Plus size={16} className="text-slate-600" />
                      </button>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 h-44 rounded-[32px] flex flex-col items-center justify-center border border-slate-100 shadow-inner group">
              <Zap className={`mb-3 transition-colors ${oxygen < 10 ? 'text-rose-500 animate-bounce' : 'text-indigo-600'}`} size={32} />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Emergency Reserve</p>
              <p className={`text-xs font-black uppercase tracking-widest mt-1 ${oxygen < 10 ? 'text-rose-600' : 'text-slate-900'}`}>
                {!isAuthorized ? 'ENCRYPTED' : (oxygen < 10 ? 'CRITICAL LOW' : 'STATUS: STABLE')}
              </p>
            </div>
            
            <div className="p-8 border-4 border-rose-50 bg-rose-50/10 rounded-[32px] flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase text-rose-500 tracking-[0.4em] mb-2">Warnings</p>
              <p className="text-2xl font-black text-rose-600 tracking-tight italic">{activePatient.allergies}</p>
            </div>
          </div>
        </main>

        {/* INTEGRATED BOTTOM DOCK - AUTHENTICATION SECTION */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-5xl px-6 animate-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white/95 backdrop-blur-3xl border border-slate-100 rounded-[32px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.12)] p-4 px-8 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden min-h-[110px]">
            
            {/* PIN/Passkey Flow Overlay - EXACT REPLICA OF REQUESTED IMAGE */}
            {!isAuthorized && passkeyStep !== 'IDLE' && (
              <div className="absolute inset-0 z-20 bg-white/98 backdrop-blur-md flex items-center px-8 animate-in fade-in zoom-in-95 duration-200 rounded-[32px]">
                {/* Left Side: Icon and Input Label */}
                <div className="flex items-center space-x-6 mr-8">
                  <div className="w-16 h-16 bg-[#4f46e5] rounded-[24px] shadow-lg shadow-indigo-200 flex items-center justify-center">
                    <Key size={32} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-[#4f46e5] uppercase tracking-widest mb-3">
                      {passkeyStep === 'CREATE' ? 'Set Encryption PIN' : 'Confirm Encryption PIN'}
                    </h4>
                    {/* Big Entered PIN Boxes */}
                    <div className="flex space-x-3">
                      {[0, 1, 2, 3].map(i => {
                        const buffer = passkeyStep === 'CREATE' ? passkeyBuffer : confirmBuffer;
                        const digit = buffer[i];
                        return (
                          <div key={i} className={`w-16 h-20 rounded-[28px] flex items-center justify-center transition-all duration-300 font-black text-3xl shadow-lg ${
                            buffer.length > i 
                              ? 'bg-[#4f46e5] text-white scale-105' 
                              : 'bg-slate-100 text-transparent'
                          }`}>
                            {digit || ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Side: Number Strip Selection (Single white pill bar) */}
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="w-full h-16 bg-white border border-slate-100 rounded-full shadow-inner flex items-center justify-between px-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-50/10 blur-xl pointer-events-none"></div>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                      <button 
                        key={n} 
                        onClick={() => handlePasskeyDigit(n.toString())} 
                        className="text-slate-900 font-black text-lg hover:text-[#4f46e5] hover:scale-125 transition-all p-2 relative z-10"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 ml-6">
                  <button onClick={resetPasskeyFlow} className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all border border-slate-100">
                    <RefreshCcw size={20} />
                  </button>
                  <button 
                    onClick={handlePasskeyAction}
                    disabled={(passkeyStep === 'CREATE' ? passkeyBuffer : confirmBuffer).length < 4}
                    className="px-8 h-16 bg-[#4f46e5] text-white rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-indigo-700 disabled:opacity-30 transition-all flex items-center space-x-3 shadow-xl"
                  >
                    <span>{passkeyStep === 'CREATE' ? 'Next' : 'Verify'}</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Default Unauthorized View (Personnel Verification visible here) */}
            {isAuthorized ? (
              <div className="flex-1 flex items-center justify-between w-full animate-in fade-in duration-500">
                <div className="flex items-center space-x-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-[22px] bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                      <ShieldCheck size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[14px] font-black uppercase tracking-widest text-slate-900 block leading-none">Grid Secured</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mt-1">Authorized Access Node</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => { setIsAuthorized(false); setIsPasskeySet(false); }}
                    className="px-8 py-4 bg-white text-rose-500 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all shadow-sm"
                  >
                    Lock Session
                  </button>
                  <div className="flex items-center space-x-2 border-l border-slate-100 pl-6 h-10">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
                  </div>
                </div>
              </div>
            ) : passkeyStep === 'IDLE' && (
              <>
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-3xl shadow-sm">
                    <ShieldAlert size={28} className="text-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-indigo-600 bg-indigo-50/50 px-3 py-1 rounded-lg uppercase tracking-tight inline-block">Personnel Verification</h4>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1.5 italic">Secure Health Infrastructure Node Access Required</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={startFingerprintAuth}
                    className="flex items-center space-x-4 px-8 py-5 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-[24px] transition-all shadow-xl active:scale-95 group"
                  >
                    <Fingerprint size={20} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Biometric Sync</span>
                  </button>
                  <button 
                    onClick={() => !isPasskeySet && setPasskeyStep('CREATE')}
                    disabled={isPasskeySet}
                    className={`flex items-center space-x-4 px-8 py-5 rounded-[24px] transition-all border active:scale-95 group ${
                      isPasskeySet 
                      ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed shadow-inner' 
                      : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-800 shadow-sm'
                    }`}
                  >
                    <Key size={20} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                      {isPasskeySet ? 'PIN Registered' : 'Input Key'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartHospital;
