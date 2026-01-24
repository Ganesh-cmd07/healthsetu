
import React, { useState } from 'react';
import { 
  Globe, Radio, Activity, AlertTriangle, ChevronRight, PhoneForwarded, Video, User, 
  CheckCircle, BookOpen, GraduationCap, Map, Users, Pill, BarChart3, Search, 
  Microscope, MessageSquare, Layout, HardDrive, Zap, Home
} from 'lucide-react';

enum GridSubPortal {
  SAFETY_COMMAND = 'SAFETY_COMMAND',
  STUDENT_HUB = 'STUDENT_HUB',
  RURAL_OUTREACH = 'RURAL_OUTREACH'
}

const NationalGrid: React.FC = () => {
  const [activePortal, setActivePortal] = useState<GridSubPortal>(GridSubPortal.SAFETY_COMMAND);
  const [reportsCount, setReportsCount] = useState(1240);
  const [activeBatch] = useState('Batch-B123');
  const [toast, setToast] = useState<string | null>(null);

  const handleReport = () => {
    setReportsCount(prev => prev + 1);
    setToast("Report Logged. Batch B-123 flagged for review.");
    setTimeout(() => setToast(null), 3000);
  };

  const NavButton: React.FC<{ portal: GridSubPortal, icon: React.ReactNode, label: string }> = ({ portal, icon, label }) => (
    <button 
      onClick={() => setActivePortal(portal)}
      className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
        activePortal === portal 
          ? 'bg-purple-600 text-white border-purple-500 shadow-xl shadow-purple-200' 
          : 'bg-white text-slate-400 border-slate-100 hover:border-purple-200 hover:bg-purple-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in relative">
      {toast && (
        <div className="fixed top-8 right-8 z-[300] bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right-4">
          <CheckCircle size={20} />
          <span>{toast}</span>
        </div>
      )}

      {/* Grid Sub-Portal Switcher */}
      <div className="flex flex-wrap gap-4 p-2 bg-slate-100/50 rounded-[28px] w-fit border border-slate-200/50">
        <NavButton portal={GridSubPortal.SAFETY_COMMAND} icon={<Globe size={16} />} label="Safety Command" />
        <NavButton portal={GridSubPortal.STUDENT_HUB} icon={<GraduationCap size={16} />} label="Student Research" />
        <NavButton portal={GridSubPortal.RURAL_OUTREACH} icon={<Map size={16} />} label="ABHA Rural Outreach" />
      </div>

      <header className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            {activePortal === GridSubPortal.SAFETY_COMMAND && "Command Center"}
            {activePortal === GridSubPortal.STUDENT_HUB && "Research Hub"}
            {activePortal === GridSubPortal.RURAL_OUTREACH && "Village Connectivity"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {activePortal === GridSubPortal.SAFETY_COMMAND && "Real-time pharmacovigilance & safety monitoring."}
            {activePortal === GridSubPortal.STUDENT_HUB && "Anonymized clinical datasets for medical excellence."}
            {activePortal === GridSubPortal.RURAL_OUTREACH && "ABHA team interface for rural healthcare delivery."}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Live Grid Sync</span>
        </div>
      </header>

      {/* PORTAL: SAFETY COMMAND */}
      {activePortal === GridSubPortal.SAFETY_COMMAND && (
        <div className="grid lg:grid-cols-10 gap-8 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-purple-50 rounded-[24px]">
                  <Radio className="text-purple-600 w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Safety Watchtower</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-Border Monitoring</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Active Flag</p>
                  <h4 className="text-3xl font-black text-slate-800 tracking-tight">{activeBatch}</h4>
                  <p className="text-[10px] font-bold text-rose-500 mt-2">Critical Reporting Threshold</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Reports Today</p>
                  <h4 className="text-3xl font-black text-slate-800 tabular-nums">{reportsCount.toLocaleString()}</h4>
                  <p className="text-[10px] font-bold text-purple-600 mt-2">↑ 12% from yesterday</p>
                </div>
              </div>

              <button 
                id="report-btn"
                onClick={handleReport}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-rose-600 transition-all active:scale-95 shadow-xl flex items-center justify-center space-x-3 group"
              >
                <AlertTriangle size={18} className="text-rose-400 group-hover:text-white transition-colors" />
                <span>Submit National Safety Report</span>
              </button>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 p-8">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 italic">Grid Intelligence Feed</h4>
               <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-default border border-transparent hover:border-slate-100">
                      <div className="w-1.5 h-10 bg-purple-200 rounded-full mt-1"></div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">New interaction pattern detected in Maharashtra region.</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">4 Minutes Ago</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl p-8 relative flex flex-col justify-between min-h-[400px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
              <div>
                <div className="inline-flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-xl mb-8">
                  <PhoneForwarded size={16} className="text-indigo-400" />
                  <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Rural Kiosk Active</span>
                </div>
                <h3 className="text-4xl font-black text-white leading-[1.1] tracking-tighter mb-6">Connect Urban Minds to Rural Needs.</h3>
                <p className="text-indigo-200/60 font-medium mb-12">Direct bridge for city specialists to consult with patients in tiered village zones via local volunteers.</p>
              </div>
              <button className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xs uppercase hover:bg-indigo-50 transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95">
                <Video size={18} />
                <span>Initialize Remote Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL: STUDENT HUB */}
      {activePortal === GridSubPortal.STUDENT_HUB && (
        <div className="grid lg:grid-cols-10 gap-8 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Resource Sidebar</h4>
              <nav className="space-y-2">
                {[
                  { icon: <BookOpen size={16} />, label: "Case Study Vault", count: 128 },
                  { icon: <BarChart3 size={16} />, label: "Public Health Datasets", count: "42GB" },
                  { icon: <Microscope size={16} />, label: "AI Model Sandbox", count: "v3.1" },
                  { icon: <MessageSquare size={16} />, label: "Peer Collaboration", count: 12 }
                ].map((item, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                    <div className="flex items-center space-x-3">
                      <div className="text-slate-400 group-hover:text-purple-600 transition-colors">{item.icon}</div>
                      <span className="text-xs font-black text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-300">{item.count}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="bg-purple-600 rounded-[32px] p-8 text-white shadow-xl shadow-purple-100">
               <GraduationCap size={32} className="mb-4 text-purple-200" />
               <h4 className="text-xl font-black leading-tight mb-4 tracking-tight">Become a Grid Researcher</h4>
               <p className="text-sm font-medium text-purple-100 mb-6 opacity-80">Apply for high-level access to anonymized pharmacovigilance streams.</p>
               <button className="w-full bg-white text-purple-600 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Submit Application</button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><BarChart3 size={24} /></div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Anonymized Trends</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">National Prescription Data (Week-View)</p>
                   </div>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl">
                  <button className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-[10px] font-black uppercase shadow-sm">Antibiotics</button>
                  <button className="px-3 py-1.5 rounded-lg text-slate-400 text-[10px] font-black uppercase">Vitamins</button>
                </div>
              </div>

              {/* Simulated Chart Area */}
              <div className="h-64 flex items-end justify-between px-4 mb-6">
                {[45, 67, 43, 89, 120, 95, 110, 80, 140, 100].map((h, i) => (
                  <div key={i} className="w-full mx-1 group relative">
                    <div 
                      className="bg-indigo-600 rounded-t-xl transition-all duration-1000 group-hover:bg-purple-500 cursor-help" 
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Batch Count: {h * 12}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-4 border-t pt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>Phase 01</span>
                <span>Phase 02</span>
                <span>Phase 03</span>
                <span>Current</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-purple-600"><Search size={28} /></div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">Knowledge Base</h4>
                    <p className="text-lg font-black text-slate-900 leading-tight">Query Health-Setu Library</p>
                  </div>
               </div>
               <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-indigo-600"><HardDrive size={28} /></div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">Storage Allocation</h4>
                    <p className="text-lg font-black text-slate-900 leading-tight">My Research Cloud</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL: RURAL OUTREACH (ABHA TEAM) */}
      {activePortal === GridSubPortal.RURAL_OUTREACH && (
        <div className="grid lg:grid-cols-10 gap-8 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center space-x-4">
                   <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Map size={28} /></div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Village Node Monitoring</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Active Connectors: 42 Rural Zones</p>
                   </div>
                </div>
                <button className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                   <Layout size={16} />
                   <span>Map View</span>
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Kasarawad Kiosk 01", location: "MP, Khargone", status: "ONLINE", volunteers: 4, inventory: "STABLE" },
                  { name: "Sihore Rural Unit", location: "MP, Sihore", status: "BUSY", volunteers: 2, inventory: "LOW" },
                  { name: "Alirajpur Mobile", location: "MP, West Nimar", status: "ONLINE", volunteers: 5, inventory: "STABLE" }
                ].map((kiosk, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300 group-hover:text-emerald-500 transition-colors">
                        <Home size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg leading-tight">{kiosk.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{kiosk.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-12">
                       <div className="text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Volunteers</p>
                          <p className="text-sm font-black text-slate-900">{kiosk.volunteers}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Inventory</p>
                          <p className={`text-[10px] font-black px-2 py-0.5 rounded ${kiosk.inventory === 'LOW' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {kiosk.inventory}
                          </p>
                       </div>
                       <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${kiosk.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{kiosk.status}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
               <Users size={32} className="mb-4 text-indigo-300" />
               <h4 className="text-xl font-black leading-tight mb-2 tracking-tight">ABHA Volunteer Hub</h4>
               <p className="text-sm text-indigo-200 font-medium mb-8 leading-relaxed">Coordinate with local volunteers for doorstep prescription delivery and telehealth assistance.</p>
               <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl flex items-center justify-center space-x-2">
                 <span>Manage Team</span>
                 <ChevronRight size={14} />
               </button>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
               <div className="flex items-center space-x-4 mb-6">
                 <div className="p-3 bg-rose-50 rounded-2xl text-rose-500"><Pill size={24} /></div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Supply Grid</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Rural Kiosk Stock</p>
                 </div>
               </div>
               <div className="space-y-4">
                 {[
                   { item: "Paracetamol", stock: "14%", critical: true },
                   { item: "Antiseptic", stock: "82%", critical: false },
                   { item: "Bandages", stock: "60%", critical: false }
                 ].map((inv, idx) => (
                   <div key={idx} className="space-y-1.5">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-500">{inv.item}</span>
                       <span className={inv.critical ? "text-rose-600" : "text-emerald-600"}>{inv.stock}</span>
                     </div>
                     <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                        className={`h-full transition-all duration-1000 ${inv.critical ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: inv.stock }}
                       ></div>
                     </div>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-8 bg-slate-50 text-slate-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">
                 Request Restock
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NationalGrid;
