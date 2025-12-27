
import React, { useState, useRef, useEffect } from 'react';
import { getLogisticsAdvice } from '../sevices/geminiService';
import { Bot, Send, User, Loader2, Sparkles } from 'lucide-react';
import { Language } from '../types';
import  translations  from '../translations';

interface AIConsultantProps {
  lang: Language;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ lang }) => {
  const t = translations[lang];
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: lang === 'hi' ? 'नमस्ते! मैं स्पैसिफ़ाई AI हूँ। मैं शिपिंग, बजट और दस्तावेज़ों में आपकी मदद कर सकता हूँ।' : 'Hello! I am Spacify AI. I can help you with shipping, rates, and documentation.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const prompt = lang === 'hi' ? `In Hindi: ${userMsg}` : userMsg;
    const aiResponse = await getLogisticsAdvice(prompt);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100"><Bot size={28} className="stroke-[2.5]" /></div>
          <div><h2 className="text-xl font-black text-slate-900 tracking-tight">{t.aiBot}</h2></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md ${m.role === 'user' ? 'bg-slate-200' : 'bg-indigo-600 text-white'}`}><User size={20} /></div>
              <div className={`p-5 rounded-3xl text-sm font-bold leading-relaxed ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'}`}>{m.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100"><Loader2 size={16} className="animate-spin" /> {lang === 'hi' ? 'सोच रहा हूँ...' : 'Thinking...'}</div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-50 bg-white">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex gap-3">
          <input type="text" className="flex-1 pl-6 pr-12 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold" placeholder={lang === 'hi' ? 'कुछ भी पूछें...' : 'Ask anything...'} value={input} onChange={(e) => setInput(e.target.value)} />
          <button type="submit" className="p-5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl"><Send size={24} /></button>
        </form>
      </div>
    </div>
  );
};

export default AIConsultant;
