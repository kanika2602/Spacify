
import React, { useState } from 'react';
import { Box, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Globe } from 'lucide-react';
import { UserRole, Language } from '../types';
import  translations  from '../translations';

interface LoginProps {
  onLogin: (user: any) => void;
  lang: Language;
}

const Login: React.FC<LoginProps> = ({ onLogin, lang }) => {
  const t = translations[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TRADER);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        uid: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: role,
        isApproved: true
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in duration-500">
        <div className="hidden md:flex flex-col justify-between p-12 bg-indigo-600 text-white">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Box size={40} className="stroke-[2.5]" />
              <span className="text-3xl font-black tracking-tighter">{t.appName}</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">{t.tagline}</h1>
            <p className="text-indigo-100 text-lg opacity-90 leading-relaxed">
              Find space, book in real-time, and scale globally.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
              <ShieldCheck className="text-indigo-200" />
              <span className="text-sm font-medium">Enterprise Security Secured</span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{isRegistering ? t.signUpTitle : t.loginTitle}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Identify As</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.TRADER)}
                  className={`py-3 px-4 rounded-2xl text-[10px] font-black transition-all border uppercase tracking-wider ${
                    role === UserRole.TRADER ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {t.roleTrader}
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.PROVIDER)}
                  className={`py-3 px-4 rounded-2xl text-[10px] font-black transition-all border uppercase tracking-wider ${
                    role === UserRole.PROVIDER ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {t.roleProvider}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
                <input
                  type="password"
                  required
                  placeholder={t.passwordPlaceholder}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>{isRegistering ? t.signUp : t.signIn} <ArrowRight size={18} /></>}
            </button>
          </form>
          <button onClick={() => setIsRegistering(!isRegistering)} className="mt-6 text-indigo-600 font-bold hover:underline text-sm mx-auto">
            {isRegistering ? 'Have an account? Login' : 'Need a business account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
