
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flower2, 
  Hospital, 
  Network, 
  Menu, 
  X, 
  LayoutDashboard,
  LogOut,
  User
} from 'lucide-react';
import { HealthLayer } from './types';
import PatientGuardian from './components/PatientGuardian';
import FemSync from './components/FemSync';
import SmartHospital from './components/SmartHospital';
import NationalGrid from './components/NationalGrid';
import DashboardOverview from './components/DashboardOverview';
import SignInPortal from './components/SignInPortal';
import PortalSelector from './components/PortalSelector';

const App: React.FC = () => {
  const [view, setView] = useState<'SELECTOR' | 'LOGIN' | 'APP'>('SELECTOR');
  const [activeLayer, setActiveLayer] = useState<HealthLayer | 'DASHBOARD'>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handlePortalSelect = (layer: HealthLayer) => {
    setActiveLayer(layer);
    setView('LOGIN');
  };

  const handleLoginSuccess = (role: HealthLayer | 'DASHBOARD', email: string) => {
    setUserEmail(email);
    // If they were logging into a specific portal, keep that. 
    // Otherwise, use the role assigned to their account.
    if (activeLayer === 'DASHBOARD') {
        setActiveLayer(role);
    }
    setView('APP');
  };

  const handleLogout = () => {
    setUserEmail('');
    setActiveLayer('DASHBOARD');
    setView('SELECTOR');
  };

  const getDisplayName = (email: string) => {
    if (!email) return "Guest User";
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const NavItem: React.FC<{ 
    layer: HealthLayer | 'DASHBOARD', 
    icon: React.ReactNode, 
    label: string, 
    colorClass: string 
  }> = ({ layer, icon, label, colorClass }) => (
    <button
      onClick={() => {
        setActiveLayer(layer);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
        activeLayer === layer 
          ? `${colorClass} text-white shadow-lg shadow-indigo-200` 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  // STAGE 1: CHOOSE YOUR PORTAL
  if (view === 'SELECTOR') {
    return <PortalSelector onSelect={handlePortalSelect} />;
  }

  // STAGE 2: AUTHENTICATION
  if (view === 'LOGIN') {
    return <SignInPortal onLoginSuccess={handleLoginSuccess} />;
  }

  // STAGE 3: MAIN APPLICATION
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row animate-in fade-in duration-1000">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-800">Health-Setu</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:flex items-center space-x-3 mb-10">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Health-Setu</h1>
              <p className="text-xs text-indigo-500 font-semibold tracking-wider uppercase">AI Healthcare Grid</p>
            </div>
          </div>

          <nav className="space-y-2 flex-grow">
            <NavItem 
              layer="DASHBOARD" 
              icon={<LayoutDashboard size={20} />} 
              label="Overview" 
              colorClass="bg-indigo-600" 
            />
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">The 4 Layers</div>
            <NavItem 
              layer={HealthLayer.PATIENT_GUARDIAN} 
              icon={<ShieldCheck size={20} />} 
              label="AI Guardian" 
              colorClass="bg-emerald-600" 
            />
            <NavItem 
              layer={HealthLayer.FEM_SYNC} 
              icon={<Flower2 size={20} />} 
              label="Fem-Sync" 
              colorClass="bg-rose-500" 
            />
            <NavItem 
              layer={HealthLayer.SMART_HOSPITAL} 
              icon={<Hospital size={20} />} 
              label="Smart Hospital" 
              colorClass="bg-blue-600" 
            />
            <NavItem 
              layer={HealthLayer.NATIONAL_GRID} 
              icon={<Network size={20} />} 
              label="National Grid" 
              colorClass="bg-purple-600" 
            />
          </nav>

          <div className="mt-auto pt-6 border-t space-y-4">
            <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl overflow-hidden">
              <div className="bg-slate-200 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <User className="text-slate-500" />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-gray-800 truncate">{getDisplayName(userEmail)}</p>
                <p className="text-[10px] text-gray-500 font-medium truncate italic">{userEmail}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 text-rose-600 hover:bg-rose-50 p-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-rose-100"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeLayer === 'DASHBOARD' && <DashboardOverview onSelectLayer={setActiveLayer} />}
          {activeLayer === HealthLayer.PATIENT_GUARDIAN && <PatientGuardian />}
          {activeLayer === HealthLayer.FEM_SYNC && <FemSync />}
          {activeLayer === HealthLayer.SMART_HOSPITAL && <SmartHospital />}
          {activeLayer === HealthLayer.NATIONAL_GRID && <NationalGrid />}
        </div>
      </main>
    </div>
  );
};

export default App;
