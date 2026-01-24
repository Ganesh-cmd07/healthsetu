
import React, { useState, useEffect, useRef } from 'react';
import { 
  Flower2, 
  Brain, 
  AlertCircle, 
  Loader2,
  Send,
  Plus,
  Minus,
  Moon,
  Apple,
  Droplets,
  Zap
} from 'lucide-react';
import { chatWithAugust } from '../geminiService';
import { MigraineRiskResponse } from '../types';

interface WellnessTargets {
  sleep: string;
  food: string[];
  water: string;
}

const FemSync: React.FC = () => {
  const [cycleDay, setCycleDay] = useState<number>(14);
  const [riskData, setRiskData] = useState<MigraineRiskResponse | null>(null);
  const [moodText, setMoodText] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'Hi! I am August, your wellness companion. How are you feeling during your ovulation phase?' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isAnalyzing]);

  const calculatePrediction = (day: number) => {
    if (day > 20) {
      setRiskData({
        risk_level: 'HIGH',
        cause: 'Luteal Phase Hormone Drop',
        advice: 'Start hydration protocol now. Avoid heavy caffeine.'
      });
    } else {
      setRiskData({
        risk_level: 'LOW',
        cause: 'Stable Estrogen Levels',
        advice: 'Balance energy with regular hydration.'
      });
    }
  };

  useEffect(() => {
    calculatePrediction(cycleDay);
  }, [cycleDay]);

  const handleSendMessage = async () => {
    if (!moodText.trim() || isAnalyzing) return;
    
    const userMsg = moodText;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setMoodText('');
    setIsAnalyzing(true);

    const historyForAI = chatHistory.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.text }]
    }));

    const aiResponse = await chatWithAugust(userMsg, cycleDay, historyForAI);
    
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      text: aiResponse || "I'm listening. Could you tell me more about how you're feeling?"
    }]);
    setIsAnalyzing(false);
  };

  const getPhaseName = (day: number) => {
    if (day <= 5) return "Menstrual Phase";
    if (day <= 13) return "Follicular Phase";
    if (day === 14) return "Ovulation Phase";
    return "Luteal Phase";
  };

  const getWellnessTargets = (day: number): WellnessTargets => {
    if (day <= 5) {
      return {
        sleep: "8.5 - 9 Hours",
        food: ["Iron-rich Spinach", "Dark Chocolate", "Lentils"],
        water: "3.0 Liters"
      };
    } else if (day <= 13) {
      return {
        sleep: "7.5 - 8 Hours",
        food: ["Fermented Yogurt", "Lean Proteins", "Broccoli"],
        water: "2.2 Liters"
      };
    } else if (day === 14) {
      return {
        sleep: "7 Hours",
        food: ["Berries", "Walnuts", "Anti-inflammatory Salmon"],
        water: "2.5 Liters"
      };
    } else {
      return {
        sleep: "8 - 9 Hours",
        food: ["Complex Oats", "Sweet Potatoes", "Magnesium-rich Seeds"],
        water: "3.2 Liters"
      };
    }
  };

  const targets = getWellnessTargets(cycleDay);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6 space-y-6">
          {/* Phase Selector Card */}
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-rose-50 relative overflow-hidden">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-900 leading-none mb-3 tracking-tighter">
                  Day {cycleDay}
                </h2>
                <div className="inline-flex items-center space-x-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                  <span className="text-rose-600 font-black text-[10px] uppercase tracking-widest">{getPhaseName(cycleDay)}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100">
                <Flower2 className="text-rose-400 w-8 h-8" />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCycleDay(prev => Math.max(1, prev - 1))}
                  className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm hover:border-rose-200 hover:bg-rose-50 transition-all active:scale-90 shrink-0"
                >
                  <Minus size={24} strokeWidth={3} />
                </button>

                <div className="flex-1 relative h-14 flex items-center">
                  <div className="absolute inset-x-0 h-4 bg-gradient-to-r from-rose-200 via-fuchsia-300 to-purple-300 rounded-full shadow-inner"></div>
                  <input 
                    id="cycle-slider"
                    type="range" min="1" max="28" 
                    value={cycleDay}
                    onChange={(e) => setCycleDay(parseInt(e.target.value))}
                    className="relative w-full h-14 bg-transparent appearance-none cursor-pointer z-10
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:w-12 
                      [&::-webkit-slider-thumb]:h-12 
                      [&::-webkit-slider-thumb]:bg-white 
                      [&::-webkit-slider-thumb]:rounded-2xl 
                      [&::-webkit-slider-thumb]:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                      [&::-webkit-slider-thumb]:border-2 
                      [&::-webkit-slider-thumb]:border-slate-50
                      [&::-webkit-slider-thumb]:cursor-grab
                      [&::-webkit-slider-thumb]:active:cursor-grabbing
                      [&::-webkit-slider-thumb]:active:scale-95
                      [&::-webkit-slider-thumb]:transition-transform"
                  />
                </div>

                <button 
                  onClick={() => setCycleDay(prev => Math.min(28, prev + 1))}
                  className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm hover:border-rose-200 hover:bg-rose-50 transition-all active:scale-90 shrink-0"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>

              <div className="flex justify-between px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span>Start</span>
                <span className="text-rose-400">Target Range</span>
                <span>End</span>
              </div>
            </div>
          </div>

          {/* NEW: Wellness Targets Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-[32px] flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-2xl mb-4 shadow-sm border border-indigo-100">
                <Moon className="text-indigo-600 w-6 h-6" />
              </div>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Sleep Goal</p>
              <h4 className="text-lg font-black text-slate-900">{targets.sleep}</h4>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-[32px] flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-2xl mb-4 shadow-sm border border-emerald-100">
                <Droplets className="text-emerald-600 w-6 h-6" />
              </div>
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Hydration</p>
              <h4 className="text-lg font-black text-slate-900">{targets.water}</h4>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-[32px] flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-2xl mb-4 shadow-sm border border-amber-100">
                <Apple className="text-amber-600 w-6 h-6" />
              </div>
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1">Diet Focus</p>
              <div className="flex flex-col space-y-0.5">
                {targets.food.slice(0, 2).map((f, i) => (
                  <span key={i} className="text-[11px] font-bold text-slate-700">{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Alert Card */}
          <div id="prediction-result" className={`p-8 rounded-[40px] border-2 transition-all duration-500 ${
            riskData?.risk_level === 'HIGH' 
              ? 'bg-rose-600 border-rose-400 text-white shadow-xl shadow-rose-200' 
              : 'bg-white border-slate-100 text-slate-900 shadow-sm'
          }`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-2xl ${riskData?.risk_level === 'HIGH' ? 'bg-white/20' : 'bg-rose-50'}`}>
                <AlertCircle size={24} className={riskData?.risk_level === 'HIGH' ? 'text-white' : 'text-rose-500'} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Hormonal Risk Forecast</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${riskData?.risk_level === 'HIGH' ? 'text-rose-100' : 'text-slate-400'}`}>Current Status</p>
                <p className="text-2xl font-black italic">{riskData?.risk_level} Risk Level</p>
              </div>
              <div className={`h-[1px] ${riskData?.risk_level === 'HIGH' ? 'bg-white/20' : 'bg-slate-100'}`}></div>
              <p className={`text-sm font-bold leading-relaxed ${riskData?.risk_level === 'HIGH' ? 'text-rose-50' : 'text-slate-600'}`}>
                {riskData?.advice}
              </p>
            </div>
          </div>
        </div>

        {/* AI Counselor Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl flex flex-col h-[650px] sticky top-8 overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-white z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-100">
                  <Brain size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 tracking-tight">August AI</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Counselor Mode</span>
                  </div>
                </div>
              </div>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] p-5 rounded-[28px] text-sm font-bold shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-white p-5 rounded-[28px] border border-slate-100 rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-white border-t">
              <div className="relative flex items-center space-x-2">
                <textarea 
                  value={moodText}
                  onChange={(e) => setMoodText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Ask August AI about your cycle..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-[28px] p-5 pr-14 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all resize-none min-h-[60px]"
                />
                <button 
                  id="predict-btn"
                  onClick={handleSendMessage}
                  disabled={isAnalyzing}
                  className="absolute right-2 top-2 w-12 h-12 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-100 flex items-center justify-center active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FemSync;
