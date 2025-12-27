
import React, { useState } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import translations from '../translations';
import { Language } from '../types';


interface AppTourProps {
  lang: Language;
  onClose: () => void;
}

const AppTour: React.FC<AppTourProps> = ({ lang, onClose }) => {
  const [step, setStep] = useState(0);
  const t = translations[lang];

  const steps = [
    { title: t.tourWelcome, desc: 'Welcome to the future of logistics.', icon: <Sparkles className="text-yellow-400" /> },
    { title: t.marketplace, desc: t.tourMarketplace, icon: <ArrowRight className="text-indigo-400" /> },
    { title: t.aiBot, desc: t.tourAI, icon: <Sparkles className="text-purple-400" /> }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <X size={24} />
        </button>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
            {/* 
              Fix: Casting icon to React.ReactElement<any> to resolve the TypeScript error 
              where 'size' is not recognized as a valid property on the cloned element's props.
            */}
            {React.cloneElement(steps[step].icon as React.ReactElement<any>, { size: 40 })}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">{steps[step].title}</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">{steps[step].desc}</p>

          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}></div>
              ))}
            </div>
            <button 
              onClick={() => step < steps.length - 1 ? setStep(step + 1) : onClose()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 group"
            >
              {step < steps.length - 1 ? t.next : t.close}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTour;
