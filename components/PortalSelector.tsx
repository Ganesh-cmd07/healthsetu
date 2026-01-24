
import React from 'react';
import { ShieldCheck, Flower2, Hospital, Network, ArrowRight, Zap, Heart, Activity, Globe } from 'lucide-react';
import { HealthLayer } from '../types';

interface PortalSelectorProps {
  onSelect: (layer: HealthLayer) => void;
}

const PortalSelector: React.FC<PortalSelectorProps> = ({ onSelect }) => {
  const portals = [
    {
      id: HealthLayer.PATIENT_GUARDIAN,
      title: "AI Patient Guardian",
      tagline: "Personalized Care for the Common Man",
      desc: "Decode prescriptions, check drug interactions, and find affordable generic substitutes.",
      icon: <ShieldCheck className="w-12 h-12" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      hover: "hover:border-emerald-400 hover:shadow-emerald-100",
      btn: "bg-emerald-600",
      accent: <Zap className="text-amber-400 w-4 h-4" />
    },
    {
      id: HealthLayer.FEM_SYNC,
      title: "Fem-Sync specialized",
      tagline: "Predictive Care for Women's Wellness",
      desc: "Manage PCOD and Migraines with hormonal cycle tracking and AI-driven predictive insights.",
      icon: <Flower2 className="w-12 h-12" />,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-100",
      hover: "hover:border-rose-400 hover:shadow-rose-100",
      btn: "bg-rose-500",
      accent: <Heart className="text-rose-300 w-4 h-4" />
    },
    {
      id: HealthLayer.SMART_HOSPITAL,
      title: "Smart Hospital Hub",
      tagline: "Infrastructure for Modern Facilities",
      desc: "Accelerate admissions with ABHA QR scans and manage critical inventory in real-time.",
      icon: <Hospital className="w-12 h-12" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      hover: "hover:border-blue-400 hover:shadow-blue-100",
      btn: "bg-blue-600",
      accent: <Activity className="text-blue-300 w-4 h-4" />
    },
    {
      id: HealthLayer.NATIONAL_GRID,
      title: "National Safety Grid",
      tagline: "Intelligence for National Welfare",
      desc: "Crowdsourced drug safety, student research hubs, and rural ABHA team outreach portals.",
      icon: <Network className="w-12 h-12" />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      hover: "hover:border-purple-400 hover:shadow-purple-100",
      btn: "bg-purple-600",
      accent: <Globe className="text-purple-300 w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-7xl text-center mb-16">
        <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mb-8 animate-in slide-in-from-top-4 duration-1000">
          <ShieldCheck className="text-indigo-400 w-5 h-5" />
          <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Health-Setu Intelligence Network</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6 animate-in fade-in duration-1000">
          Select Your <span className="text-indigo-400 italic">Entry Portal</span>
        </h1>
        <p className="text-indigo-200/60 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          The Health-Setu grid is divided into four intelligent layers. Choose your sector to begin secure session initialization.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {portals.map((portal, idx) => (
          <button 
            key={portal.id}
            onClick={() => onSelect(portal.id)}
            className={`group text-left bg-white rounded-[40px] p-8 border-2 ${portal.border} ${portal.hover} transition-all duration-500 flex flex-col justify-between h-[420px] shadow-2xl animate-in slide-in-from-bottom-8`}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div>
              <div className={`w-20 h-20 ${portal.bg} rounded-[28px] flex items-center justify-center ${portal.color} mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {portal.icon}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                {portal.accent}
                <span className={`text-[10px] font-black uppercase tracking-widest ${portal.color} opacity-60`}>
                  {portal.tagline}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                {portal.title}
              </h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                {portal.desc}
              </p>
            </div>
            
            <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
              <span className={`font-black text-[10px] uppercase tracking-widest ${portal.color}`}>Initialize Portal</span>
              <div className={`w-12 h-12 ${portal.btn} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                <ArrowRight size={20} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-16 text-center animate-in fade-in duration-1000 delay-1000">
        <p className="text-indigo-300/40 text-[10px] font-black uppercase tracking-[0.4em]">
          Secure Gateway v2.4.1 // Protected by AI-Grid Encryption
        </p>
      </div>
    </div>
  );
};

export default PortalSelector;
