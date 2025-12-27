
import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, Booking, Language, BookingStatus } from './types';
import Marketplace from './components/Marketplace.tsx';
import Login from './components/Login.tsx';
import AppTour from './components/AppTour.tsx';
import AIConsultant from './components/AIConsultant.tsx';
import translations from './translations';
import { 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  Briefcase,
  Shield,
  Bell,
  Box,
  Truck,
  IndianRupee,
  Clock,
  History,
  Languages,
  HelpCircle,
  Moon,
  Sun,
  Trash2,
  AlertTriangle,
  Info,
  LifeBuoy
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'MARKETPLACE' | 'AI' | 'DASHBOARD' | 'HISTORY'>('MARKETPLACE');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showTour, setShowTour] = useState(false);
  const [notifications, setNotifications] = useState<{msg: string, type: 'info' | 'alert' | 'success'}[]>([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('spacify_theme') === 'dark');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const t = translations[lang];

  useEffect(() => {
    const saved = localStorage.getItem('spacify_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      if (parsed.preferredLanguage) setLang(parsed.preferredLanguage);
    }
  }, []);

  useEffect(() => {
    if (user && !localStorage.getItem('spacify_tour_completed')) {
      setShowTour(true);
    }
    setNotifications([{msg: t.tourWelcome, type: 'info'}]);
  }, [user, lang]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('spacify_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('spacify_theme', 'light');
    }
  }, [darkMode]);

  const handleLogin = (userData: UserProfile) => {
    const enrichedUser = { ...userData, preferredLanguage: lang };
    setUser(enrichedUser);
    localStorage.setItem('spacify_user', JSON.stringify(enrichedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('spacify_user');
  };

  const handleNewBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    setNotifications(prev => [{msg: `Space Secured: ${booking.containerOrigin} Hub Confirmed`, type: 'success'}, ...prev]);
    setActiveTab('HISTORY');
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: BookingStatus.CANCELLED } : b));
    setNotifications(prev => [
      {msg: t.refundNotice, type: 'alert'},
      {msg: t.cancelSuccess, type: 'success'},
      ...prev
    ]);
    setCancellingId(null);
  };

  const handleRaiseDispute = (id: string) => {
    setNotifications(prev => [{msg: t.disputeSubmitted, type: 'info'}, ...prev]);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  if (!user) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <button 
          onClick={toggleLanguage}
          className="fixed top-8 right-8 z-[100] flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl text-white font-black text-xs border border-white/20 hover:bg-white/30 transition-all"
        >
          <Languages size={16} /> {t.langSwitch}
        </button>
        <Login onLogin={handleLogin} lang={lang} />
      </div>
    );
  }

  const NavItem = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'stroke-[2.5]' : ''} />
      <span className={`font-bold text-sm tracking-tight ${!isSidebarOpen && 'hidden'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
      {showTour && <AppTour lang={lang} onClose={() => { setShowTour(false); localStorage.setItem('spacify_tour_completed', 'true'); }} />}
      
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col fixed inset-y-0 z-50`}>
        <div className="p-8 flex items-center justify-between">
          <div className={`flex items-center gap-3 text-indigo-600 dark:text-indigo-400 ${!isSidebarOpen && 'hidden'}`}>
            <Box size={32} className="stroke-[2.5]" />
            <span className="text-2xl font-black tracking-tighter">{t.appName}</span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem id="DASHBOARD" icon={LayoutDashboard} label={t.dashboard} />
          <NavItem id="MARKETPLACE" icon={Search} label={t.marketplace} />
          <NavItem id="HISTORY" icon={History} label={t.history} />
          <NavItem id="AI" icon={MessageSquare} label={t.aiBot} />
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all font-bold text-xs"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className={!isSidebarOpen ? 'hidden' : ''}>{darkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
          <button 
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all font-bold text-xs"
          >
            <Languages size={18} />
            <span className={!isSidebarOpen ? 'hidden' : ''}>{t.langSwitch}</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 text-slate-500 hover:text-red-600 transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className={`font-bold text-sm ${!isSidebarOpen && 'hidden'}`}>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-24'}`}>
        <header className="h-24 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 border-b border-slate-100 dark:border-slate-800 px-10 flex items-center justify-between z-40">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeTab === 'DASHBOARD' && t.dashboard}
              {activeTab === 'MARKETPLACE' && t.marketplace}
              {activeTab === 'AI' && t.aiBot}
              {activeTab === 'HISTORY' && t.history}
            </h2>
            <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">
              {user.role} Verified
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors relative">
                <Bell size={22} />
                {notifications.length > 0 && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900"></span>}
              </button>
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all p-4 z-50">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-4 px-2">System Activity</h4>
                <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
                  {notifications.map((n, i) => (
                    <div key={i} className={`p-4 rounded-2xl text-[11px] font-bold border leading-relaxed ${
                      n.type === 'alert' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50' :
                      n.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50' :
                      'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700'
                    }`}>
                      {n.type === 'alert' && <div className="flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[9px]"><AlertTriangle size={12}/> Policy Update</div>}
                      {n.msg}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-900 dark:text-white leading-none">{user.name}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {user.uid.slice(-4)}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {activeTab === 'MARKETPLACE' && <Marketplace onBook={handleNewBooking} lang={lang} />}
          {activeTab === 'AI' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AIConsultant lang={lang} />
            </div>
          )}
          {activeTab === 'HISTORY' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t.history}</h1>
              {bookings.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-20 flex flex-col items-center text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <History size={64} className="text-slate-200 dark:text-slate-800 mb-6" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No active bookings</h3>
                  <button onClick={() => setActiveTab('MARKETPLACE')} className="mt-8 px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">{t.marketplace}</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(b => (
                    <div key={b.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-800 transition-all gap-6">
                      <div className="flex items-center gap-6">
                        <div className={`p-5 rounded-3xl ${b.status === BookingStatus.CANCELLED ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                          <History size={28} />
                        </div>
                        <div>
                          <div className={`text-lg font-black leading-tight ${b.status === BookingStatus.CANCELLED ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                            {b.containerOrigin} → {b.containerDestination}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-widest">Transaction: {b.id}</div>
                          {b.status === BookingStatus.CANCELLED && (
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-amber-600 font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full w-fit">
                              <Info size={12}/> {lang === 'hi' ? 'रिफंड प्रक्रिया में' : 'Refund in Progress'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 justify-between md:justify-end">
                        <div className="text-right">
                          <div className={`text-2xl font-black flex items-center gap-1 justify-end leading-none mb-2 ${b.status === BookingStatus.CANCELLED ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                            <IndianRupee size={20} />{b.totalPrice.toLocaleString()}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${
                            b.status === BookingStatus.CANCELLED 
                              ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500' 
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                          }`}>
                            {b.status === BookingStatus.CANCELLED ? t.cancelled : t.confirmed}
                          </span>
                        </div>

                        {b.status !== BookingStatus.CANCELLED ? (
                          <div className="relative">
                            {cancellingId === b.id ? (
                              <div className="absolute right-0 bottom-0 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-2xl rounded-3xl p-6 z-10 w-64 animate-in zoom-in slide-in-from-right-4">
                                <AlertTriangle className="text-amber-500 mb-3" size={24} />
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-4">{t.confirmCancel}</p>
                                <div className="flex flex-col gap-2">
                                  <button 
                                    onClick={() => handleCancelBooking(b.id)}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest transition-all"
                                  >
                                    {t.yesCancel}
                                  </button>
                                  <button 
                                    onClick={() => setCancellingId(null)}
                                    className="w-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest transition-all"
                                  >
                                    {t.noKeep}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setCancellingId(b.id)}
                                className="p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all group"
                                title={t.cancelBooking}
                              >
                                <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleRaiseDispute(b.id)}
                            className="flex items-center gap-2 px-5 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-100 dark:border-indigo-900/20"
                          >
                            <LifeBuoy size={14} /> {t.raiseDispute}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'DASHBOARD' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="col-span-1 md:col-span-3 bg-slate-900 dark:bg-indigo-950 rounded-[48px] p-16 text-white relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tighter">
                      {lang === 'hi' ? `नमस्ते, ${user.name}!` : `Global Logistics, Localized.`}
                    </h1>
                    <p className="text-slate-400 dark:text-indigo-200 text-xl font-medium leading-relaxed mb-12 opacity-80">
                      Spacify is India's most advanced marketplace for shared cargo. Book secure space in real-time with hub utility validation.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => setActiveTab('MARKETPLACE')} className="bg-white text-slate-900 px-10 py-5 rounded-3xl font-black text-sm hover:bg-indigo-50 transition-all uppercase tracking-widest">{t.bookNow}</button>
                      <button onClick={() => setActiveTab('AI')} className="bg-white/10 text-white px-10 py-5 rounded-3xl font-black text-sm hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md uppercase tracking-widest">{t.aiBot}</button>
                    </div>
                  </div>
                  <Box className="absolute -right-16 -bottom-16 text-white/5 group-hover:text-white/10 transition-all duration-1000 -rotate-12" size={540} strokeWidth={1} />
               </div>
               
               <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group">
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-3xl transition-transform group-hover:scale-110"><IndianRupee size={28} /></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 rounded-full">Secure</span>
                  </div>
                  <div className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter mb-3">
                    ₹{(bookings.filter(b => b.status !== BookingStatus.CANCELLED).reduce((sum, b) => sum + b.totalPrice, 0)).toLocaleString()}
                  </div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.totalSpent}</div>
               </div>

               <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group">
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl transition-transform group-hover:scale-110"><Truck size={28} /></div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full">Tracking</span>
                  </div>
                  <div className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter mb-3">{bookings.filter(b => b.status !== BookingStatus.CANCELLED).length}</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.activeConsignments}</div>
               </div>

               <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group">
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-3xl transition-transform group-hover:scale-110"><Shield size={28} /></div>
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/30 px-4 py-1.5 rounded-full">Verified</span>
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tighter mb-3">{t.kycVerified}</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Enterprise Trust</div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
