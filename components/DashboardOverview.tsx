
import React from 'react';
import { 
  ShieldCheck, 
  Flower2, 
  Hospital, 
  Network, 
  TrendingUp, 
  AlertCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { HealthLayer } from '../types';

interface DashboardOverviewProps {
  onSelectLayer: (layer: HealthLayer) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSelectLayer }) => {
  // Define the 4 core layers of Health-Setu
  const layers = [
    {
      id: HealthLayer.PATIENT_GUARDIAN,
      title: 'AI Patient Guardian',
      desc: 'Smart prescriptions, interaction radar & emergency SOS.',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-100 text-emerald-700',
      btn: 'bg-emerald-600'
    },
    {
      id: HealthLayer.FEM_SYNC,
      title: 'Fem-Sync specialized',
      desc: 'Predictive migraine analysis and hormonal cycle wellness.',
      icon: <Flower2 className="w-8 h-8 text-rose-500" />,
      color: 'bg-rose-50 border-rose-100 text-rose-700',
      btn: 'bg-rose-500'
    },
    {
      id: HealthLayer.SMART_HOSPITAL,
      title: 'Smart Hospital Hub',
      desc: 'One-scan admission and priority-based smart triage.',
      icon: <Hospital className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-100 text-blue-700',
      btn: 'bg-blue-600'
    },
    {
      id: HealthLayer.NATIONAL_GRID,
      title: 'National Safety Grid',
      desc: 'Crowdsourced pharmacovigilance and rural tele-connect.',
      icon: <Network className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-100 text-purple-700',
      btn: 'bg-purple-600'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="bg-indigo-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">The AI Health Infrastructure for India.</h1>
          <p className="text-indigo-200 text-lg font-medium mb-8">Bridging the gap between pharmaceutical safety, specialized care, and rural access with 4 specialized layers.</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center space-x-2">
              <TrendingUp size={18} className="text-emerald-400" />
              <span className="font-bold text-sm">4.2M Protected</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center space-x-2">
              <Activity size={18} className="text-rose-400" />
              <span className="font-bold text-sm">12s SOS Response</span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Layers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {layers.map((layer) => (
          <div 
            key={layer.id}
            className={`p-8 rounded-[32px] border-2 transition-all hover:shadow-xl cursor-pointer group flex flex-col justify-between h-full ${layer.color}`}
            onClick={() => onSelectLayer(layer.id)}
          >
            <div>
              <div className="bg-white p-4 rounded-2xl w-fit mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {layer.icon}
              </div>
              <h3 className="text-2xl font-black mb-2">{layer.title}</h3>
              <p className="opacity-80 font-medium mb-8 leading-relaxed">{layer.desc}</p>
            </div>
            <button className={`flex items-center space-x-2 text-white px-6 py-3 rounded-2xl font-black text-sm self-start shadow-lg transition-transform group-hover:translate-x-1 ${layer.btn}`}>
              <span>Explore Layer</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Global Alert Section */}
      <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-8 flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
        <div className="bg-amber-100 p-4 rounded-2xl text-amber-600 shrink-0">
          <AlertCircle size={32} />
        </div>
        <div>
          <h4 className="text-lg font-black text-amber-900">National Pharmacovigilance Alert</h4>
          <p className="text-amber-700 font-medium">Batch-X Paracetamol has reached the reporting threshold in the National Grid. Avoid usage until further notice from MoHFW.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
