
import React, { useState, useRef } from 'react';
import { 
  Camera, Clock, Search, ShieldAlert, Zap, Loader2,
  PhoneCall, CheckCircle, FileText, Info, AlertTriangle, 
  IndianRupee, Pill, TrendingDown, Calendar, User, PlusCircle, History, ChevronRight, Eye
} from 'lucide-react';
import { Medication, PrescriptionData } from '../types';

// 1. DATABASE OF MOCK PRESCRIPTION RESULTS
const PRESCRIPTION_DB: Record<string, PrescriptionData> = {
    "fever": { 
        doctor: "Dr. A. Reddy (Gen. Physician)",
        date: "24 Jan 2026",
        meds: [
            { name: "Augmentin 625", type: "Antibiotic", dose: "625mg", freq: "1-0-1 (Morning & Night)", duration: "5 Days", icon: "💊" },
            { name: "Dolo 650", type: "Analgesic", dose: "650mg", freq: "SOS (When needed)", duration: "3 Days", icon: "🌡️" }
        ]
    },
    "heart": { 
        doctor: "Dr. S. Kaplan (Cardiology)",
        date: "20 Jan 2026",
        meds: [
            { name: "Warfarin", type: "Blood Thinner", dose: "5mg", freq: "0-0-1 (Night only)", duration: "30 Days", icon: "🩸" },
            { name: "Aspirin", type: "Blood Thinner", dose: "75mg", freq: "1-0-0 (Morning)", duration: "30 Days", icon: "❤️" }
        ]
    },
    "default": { 
        doctor: "Dr. Generic",
        date: "Today",
        meds: [
            { name: "Multivitamin", type: "Supplement", dose: "1 Tab", freq: "0-1-0 (After Lunch)", duration: "30 Days", icon: "🥗" }
        ]
    }
};

// MOCK HISTORY DATA
const INITIAL_HISTORY: PrescriptionData[] = [
  { 
    doctor: "Dr. M. Verma (Dermatology)", 
    date: "12 Dec 2025", 
    meds: [{ name: "Zyrtec", type: "Antihistamine", dose: "10mg", freq: "0-0-1", duration: "10 Days", icon: "🧴" }] 
  },
  { 
    doctor: "City Orthopedics", 
    date: "05 Nov 2025", 
    meds: [{ name: "Brufen 400", type: "NSAID", dose: "400mg", freq: "1-0-1", duration: "3 Days", icon: "🦴" }] 
  }
];

// 2. WHO INTERACTION DATABASE
const WHO_INTERACTION_DB = [
    { pair: ["Warfarin", "Aspirin"], severity: "CRITICAL", msg: "⚠️ DANGER: High Bleeding Risk. Avoid concurrent use." },
    { pair: ["Sildenafil", "Nitroglycerin"], severity: "CRITICAL", msg: "⚠️ FATAL RISK: Severe Hypotension (Low BP)." },
    { pair: ["Amoxicillin", "Methotrexate"], severity: "MAJOR", msg: "⚠️ WARNING: Toxic accumulation risk." },
    { pair: ["Ibuprofen", "Lisinopril"], severity: "MAJOR", msg: "⚠️ CAUTION: Kidney strain & reduced BP control." },
    { pair: ["Atorvastatin", "Clarithromycin"], severity: "MAJOR", msg: "⚠️ WARNING: Risk of muscle damage (Rhabdomyolysis)." },
    { pair: ["Paracetamol", "Alcohol"], severity: "MAJOR", msg: "⚠️ WARNING: High risk of Liver Toxicity." }
];

const normalizeDrug = (name: string): string => {
    const n = name.toLowerCase().trim();
    if (n.includes("dolo") || n.includes("crocin") || n.includes("calpol")) return "paracetamol";
    if (n.includes("augmentin")) return "amoxicillin";
    return n;
};

// 3. GENERIC MEDICINE KNOWLEDGE BASE
const GENERIC_DB = [
    { brand: "Crocin 650", generic: "Paracetamol 650mg", b_price: 30, g_price: 8, save: "73%" },
    { brand: "Augmentin 625", generic: "Amoxyclav 625", b_price: 240, g_price: 80, save: "66%" },
    { brand: "Pan D", generic: "Pantoprazole + Domperidone", b_price: 150, g_price: 45, save: "70%" },
    { brand: "Allegra 120", generic: "Fexofenadine 120mg", b_price: 180, g_price: 35, save: "80%" }
];

const PatientGuardian: React.FC = () => {
  const [activePrescription, setActivePrescription] = useState<PrescriptionData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [viewMode, setViewMode] = useState<'DECODER' | 'HISTORY'>('DECODER');
  const [history, setHistory] = useState<PrescriptionData[]>(INITIAL_HISTORY);
  
  const [drugA, setDrugA] = useState('');
  const [drugB, setDrugB] = useState('');
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
  const [radarStatus, setRadarStatus] = useState<{ msg: string, status: 'SAFE' | 'DANGER' | 'IDLE' }>({
    msg: "Safe. Input medicines for potential risk scanning against WHO database.",
    status: 'IDLE'
  });
  const [isRadarShaking, setIsRadarShaking] = useState(false);
  const [criticalAlert, setCriticalAlert] = useState<string | null>(null);

  const [brandSearch, setBrandSearch] = useState('');
  const [genericResult, setGenericResult] = useState<typeof GENERIC_DB[0] | null>(null);
  const [hasSearchedGeneric, setHasSearchedGeneric] = useState(false);
  const [isSearchingGeneric, setIsSearchingGeneric] = useState(false);

  const [sosStatus, setSosStatus] = useState<'IDLE' | 'COUNTING' | 'DISPATCHED'>('IDLE');
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrescriptionUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setActivePrescription(null);
    setCriticalAlert(null);

    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      let result: PrescriptionData = PRESCRIPTION_DB.default;

      if (fileName.includes("fever")) result = PRESCRIPTION_DB.fever;
      if (fileName.includes("heart")) result = PRESCRIPTION_DB.heart;

      setActivePrescription(result);
      setHistory(prev => [result, ...prev]);
      setIsScanning(false);
      setViewMode('DECODER');

      if (fileName.includes("heart")) {
        setDrugA("Warfarin");
        setDrugB("Aspirin");
        setRadarStatus({
          msg: "⚠️ DANGER: High Bleeding Risk. Avoid concurrent use.",
          status: 'DANGER'
        });
        setCriticalAlert("Interaction Detected: Aspirin + Warfarin = High Bleeding Risk.");
        triggerRadarShake();
      }
    }, 2000);
  };

  const checkDrugInteraction = () => {
    const valA = normalizeDrug(drugA);
    const valB = normalizeDrug(drugB);
    if (!drugA.trim() || !drugB.trim()) return;

    setIsAnalyzingRisk(true);
    setTimeout(() => {
      let foundMatch = null;
      for (const entry of WHO_INTERACTION_DB) {
        const drug1 = entry.pair[0].toLowerCase();
        const drug2 = entry.pair[1].toLowerCase();
        const matchFound = (valA.includes(drug1) && valB.includes(drug2)) || 
                           (valA.includes(drug2) && valB.includes(drug1));
        if (matchFound) {
          foundMatch = entry;
          break;
        }
      }

      if (foundMatch) {
        setRadarStatus({ msg: foundMatch.msg, status: 'DANGER' });
        triggerRadarShake();
      } else {
        setRadarStatus({ msg: "✅ Safe. No critical interactions found in WHO database.", status: 'SAFE' });
      }
      setIsAnalyzingRisk(false);
    }, 1200);
  };

  const findGenericAlternative = () => {
    const query = brandSearch.trim().toLowerCase();
    if (!query) return;

    setIsSearchingGeneric(true);
    setHasSearchedGeneric(false);
    setGenericResult(null);

    setTimeout(() => {
      const match = GENERIC_DB.find(item => item.brand.toLowerCase().includes(query));
      if (match) setGenericResult(match);
      setIsSearchingGeneric(false);
      setHasSearchedGeneric(true);
    }, 800);
  };

  const triggerRadarShake = () => {
    setIsRadarShaking(true);
    setTimeout(() => setIsRadarShaking(false), 500);
  };

  const startSOS = () => {
    setSosStatus('COUNTING');
    setCountdown(3);
    timerRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setSosStatus('DISPATCHED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopSOS = () => {
    if (sosStatus === 'COUNTING') {
      if (timerRef.current) window.clearInterval(timerRef.current);
      setSosStatus('IDLE');
      setCountdown(3);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-24 space-y-8 animate-in fade-in duration-500">
      
      {criticalAlert && (
        <div className="fixed inset-0 z-[100] bg-rose-600/90 flex items-center justify-center p-8 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[40px] text-center shadow-2xl max-w-sm animate-in zoom-in-95">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-rose-600" />
            </div>
            <h3 className="text-2xl font-black text-rose-600 mb-2 uppercase italic tracking-tighter leading-none">CRITICAL DANGER</h3>
            <p className="text-slate-800 font-bold mb-8">{criticalAlert}</p>
            <button 
              onClick={() => setCriticalAlert(null)}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              ACKNOWLEDGE WARNING
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        
        {/* LEFT COLUMN: PRESCRIPTION DIGITIZER & HISTORY */}
        <div className="lg:col-span-6 space-y-8">
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setViewMode('DECODER')}
                  className={`relative py-2 transition-all ${viewMode === 'DECODER' ? 'text-indigo-600 font-black' : 'text-slate-400 font-bold'}`}
                >
                  Decoder
                  {viewMode === 'DECODER' && <div className="absolute -bottom-8 left-0 right-0 h-1.5 bg-indigo-600 rounded-t-full"></div>}
                </button>
                <button 
                  onClick={() => setViewMode('HISTORY')}
                  className={`relative py-2 transition-all ${viewMode === 'HISTORY' ? 'text-indigo-600 font-black' : 'text-slate-400 font-bold'}`}
                >
                  Vault History
                  {viewMode === 'HISTORY' && <div className="absolute -bottom-8 left-0 right-0 h-1.5 bg-indigo-600 rounded-t-full"></div>}
                </button>
              </div>
              
              <div className="relative">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePrescriptionUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg"
                >
                  {isScanning ? <Loader2 className="animate-spin w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  <span>{isScanning ? 'Syncing...' : 'New Scan'}</span>
                </button>
              </div>
            </div>

            <div className="p-8 min-h-[500px]">
              {viewMode === 'DECODER' ? (
                isScanning ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-indigo-50 rounded-full"></div>
                        <div className="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" />
                    </div>
                    <p className="text-slate-900 font-black text-xl tracking-tighter animate-pulse">EXTRACTING MEDICAL DATA...</p>
                  </div>
                ) : activePrescription ? (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-indigo-50/30 rounded-[32px] p-8 border border-indigo-50">
                      <div className="flex justify-between items-start mb-8 pb-6 border-b border-indigo-100/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-indigo-50"><User className="text-indigo-600" /></div>
                          <div>
                            <h3 className="font-black text-slate-900 text-lg tracking-tight">{activePrescription.doctor}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mt-1">
                              <Calendar size={12} className="mr-1" /> {activePrescription.date}
                            </p>
                          </div>
                        </div>
                        <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-200">DIGITIZED OK</span>
                      </div>

                      <div className="space-y-4">
                        {activePrescription.meds.map((med, idx) => (
                          <div key={idx} className="bg-white p-5 rounded-2xl border border-indigo-50 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                            <div className="flex items-center space-x-5">
                               <div className="text-2xl w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{med.icon}</div>
                               <div>
                                 <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-black text-slate-900">{med.name}</h4>
                                    <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-0.5 rounded uppercase">{med.type}</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{med.dose} • {med.duration}</p>
                               </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-slate-900">{med.freq}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Verified</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button className="w-full mt-8 bg-[#0a0f18] text-white py-5 rounded-full font-black text-[11px] uppercase tracking-[0.15em] flex items-center justify-center space-x-4 shadow-2xl hover:bg-slate-900 transition-all active:scale-95 group border border-white/5">
                         <PlusCircle size={20} className="text-white group-hover:rotate-90 transition-transform duration-500" />
                         <span style={{ textShadow: '1px 0 #4f46e5, -1px 0 #ef4444' }}>Sync to ABHA Wallet</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="bg-slate-50 w-24 h-24 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100">
                      <FileText className="text-slate-200 w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Scanner Active</h3>
                    <p className="text-slate-400 max-w-xs mx-auto mt-2 font-medium">Capture or upload any medical document to begin the AI decoding process.</p>
                  </div>
                )
              ) : (
                /* HISTORY VIEW */
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Saved Health Vault</h3>
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-lg">{history.length} Documents</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((doc, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => { setActivePrescription(doc); setViewMode('DECODER'); }}
                        className="p-6 bg-white border border-slate-100 rounded-[28px] text-left hover:border-indigo-300 hover:shadow-lg transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50/50 rounded-bl-[40px] flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                          <Eye size={16} className="text-slate-300 group-hover:text-indigo-400" />
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                           <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                             <FileText size={18} />
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">{doc.date}</p>
                             <h4 className="font-black text-slate-900 text-sm line-clamp-1">{doc.doctor}</h4>
                           </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {doc.meds.slice(0, 2).map((m, i) => (
                             <span key={i} className="bg-slate-50 text-[9px] font-bold text-slate-500 px-2 py-1 rounded-md uppercase tracking-tight">{m.name}</span>
                           ))}
                           {doc.meds.length > 2 && <span className="text-[9px] font-black text-slate-300">+{doc.meds.length - 2} more</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RADAR & GENERIC FINDER */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Interaction Radar Section */}
          <div className={`bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 transition-transform duration-500 ${isRadarShaking ? 'animate-shake' : ''}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Safety Grid: Interaction Radar</p>
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-4 bg-orange-100 rounded-[24px]">
                <Zap className="text-orange-600 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">Cross-Check</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">WHO Database Sync</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <input 
                type="text" 
                placeholder="Medication A" 
                value={drugA} 
                onChange={(e) => setDrugA(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-orange-400 transition-all"
              />
              <input 
                type="text" 
                placeholder="Medication B" 
                value={drugB} 
                onChange={(e) => setDrugB(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-orange-400 transition-all"
              />
            </div>

            <button 
              onClick={checkDrugInteraction}
              disabled={isAnalyzingRisk}
              className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-xl ${
                isAnalyzingRisk ? 'bg-slate-200 text-slate-400' : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
              }`}
            >
              {isAnalyzingRisk ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
              <span>{isAnalyzingRisk ? 'Checking Interactions...' : 'Verify Drug Safety'}</span>
            </button>

            <div className={`mt-8 p-6 rounded-[32px] border transition-all ${
              radarStatus.status === 'DANGER' ? 'bg-red-50 border-red-100' : 
              radarStatus.status === 'SAFE' ? 'bg-green-50 border-green-100' :
              'bg-slate-50 border-slate-100'
            }`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${radarStatus.status === 'DANGER' ? 'text-rose-600' : 'text-slate-400'}`}>
                Result: {radarStatus.status}
              </p>
              <p className={`text-sm font-bold leading-relaxed ${radarStatus.status === 'DANGER' ? 'text-slate-900' : 'text-slate-500'}`}>
                {radarStatus.msg}
              </p>
            </div>
          </div>

          {/* Generic Finder Section */}
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 overflow-hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Social Good: Generic Finder</p>
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-4 bg-emerald-100 rounded-[24px]">
                <TrendingDown className="text-emerald-600 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">Price Equalizer</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gov Approved Substitutes</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative group">
                <input 
                  type="text" 
                  value={brandSearch} 
                  onChange={(e) => setBrandSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && findGenericAlternative()}
                  placeholder="Enter Brand Name"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 outline-none focus:border-emerald-300 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
              <button 
                onClick={findGenericAlternative}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all"
              >
                Search Substitutes
              </button>
            </div>

            <div id="generic-result">
              {isSearchingGeneric ? (
                 <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></div>
              ) : hasSearchedGeneric && genericResult ? (
                <div className="animate-in zoom-in-95 duration-300">
                  <div className="flex border border-slate-100 rounded-t-[32px] overflow-hidden">
                    <div className="w-1/2 bg-rose-50/50 p-5 text-center border-r border-slate-100">
                      <p className="text-[8px] font-black text-rose-500 uppercase mb-1">Branded</p>
                      <h4 className="text-[10px] font-black text-slate-900 leading-tight mb-2 h-8 flex items-center justify-center">{genericResult.brand}</h4>
                      <p className="text-lg font-black text-rose-500">₹{genericResult.b_price}</p>
                    </div>
                    <div className="w-1/2 bg-emerald-50/50 p-5 text-center">
                      <p className="text-[8px] font-black text-emerald-500 uppercase mb-1">Generic</p>
                      <h4 className="text-[10px] font-black text-slate-900 leading-tight mb-2 h-8 flex items-center justify-center">{genericResult.generic}</h4>
                      <p className="text-lg font-black text-emerald-600">₹{genericResult.g_price}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-600 p-4 rounded-b-[32px] text-center shadow-lg">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">
                      Savings of {genericResult.save} detected
                    </p>
                  </div>
                </div>
              ) : hasSearchedGeneric && (
                <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 text-center">
                  <p className="text-xs font-bold text-slate-400">Not found in local index.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-[90]">
        <button 
          onMouseDown={startSOS} onMouseUp={stopSOS} onMouseLeave={stopSOS}
          className={`w-24 h-24 rounded-[40px] flex flex-col items-center justify-center shadow-2xl transition-all active:scale-90 ${
            sosStatus === 'COUNTING' ? 'bg-slate-900 text-white scale-125' : 'bg-rose-600 text-white animate-pulse'
          }`}
        >
          {sosStatus === 'COUNTING' ? (
            <div className="text-center">
              <span className="text-4xl font-black block leading-none">{countdown}</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Hold to SOS</span>
            </div>
          ) : (
            <>
              <PhoneCall size={32} className="mb-1" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">SOS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PatientGuardian;
