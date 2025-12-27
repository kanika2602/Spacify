
import React, { useState } from 'react';
import { MOCK_CONTAINERS, MODE_ICONS } from '../constants';
import { Container, TransportMode, Booking, BookingStatus, Language, HubUtilities } from '../types';
import { Calendar, Search, CheckCircle2, Loader2, IndianRupee, Map as MapIcon, ShieldCheck, Zap, Droplets, Globe, CreditCard, ChevronRight, User, Phone, MapPin, Building2, ArrowLeft } from 'lucide-react';
import translations from '../translations';
import MapPicker from './MapPicker';

interface MarketplaceProps {
  onBook: (booking: Booking) => void;
  lang: Language;
}

const UtilityBar = ({ value, label, icon: Icon, color }: { value: number, label: string, icon: any, color: string }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
      <div className="flex items-center gap-1"><Icon size={10} /> {label}</div>
      <span>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const Marketplace: React.FC<MarketplaceProps> = ({ onBook, lang }) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<TransportMode | 'ALL'>('ALL');
  const [showMap, setShowMap] = useState(false);
  
  // Booking Modal State
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [bookingStep, setBookingStep] = useState<'VERIFY' | 'DETAILS' | 'PAY' | 'PROCESS' | 'SUCCESS'>('VERIFY');
  const [selectedBank, setSelectedBank] = useState('');
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    gstin: ''
  });

  const filtered = MOCK_CONTAINERS.filter(c => {
    const matchesSearch = c.origin.toLowerCase().includes(search.toLowerCase()) || 
                          c.destination.toLowerCase().includes(search.toLowerCase());
    const matchesMode = filterMode === 'ALL' || c.mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const isFormValid = form.name.length > 2 && form.phone.length >= 10 && form.address.length > 5 && form.gstin.length > 5;

  const startBooking = (container: Container) => {
    if (container.status === 'FULL') return;
    setSelectedContainer(container);
    setBookingStep('VERIFY');
  };

  const handleFinalPayment = () => {
    if (!selectedBank) {
      alert(t.chooseBank);
      return;
    }
    setBookingStep('PROCESS');
    setTimeout(() => {
      if (selectedContainer) {
        const newBooking: Booking = {
          id: 'B' + Math.random().toString(36).substr(2, 9),
          containerId: selectedContainer.id,
          containerOrigin: selectedContainer.origin,
          containerDestination: selectedContainer.destination,
          spaceReserved: 1,
          totalPrice: selectedContainer.pricePerCBM,
          status: BookingStatus.PAID,
          timestamp: new Date().toISOString()
        };
        onBook(newBooking);
        setBookingStep('SUCCESS');
        setTimeout(() => setSelectedContainer(null), 2000);
      }
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setShowMap(!showMap)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest flex items-center gap-2 ${showMap ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'}`}
          >
            <MapIcon size={14} /> {showMap ? 'Hide Map' : 'View Hubs'}
          </button>
          {(['ALL', ...Object.values(TransportMode)] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${
                filterMode === mode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {showMap && <MapPicker lang={lang} onSelect={() => {}} />}

      {/* Container Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filtered.map(container => (
          <div key={container.id} className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-indigo-100 dark:hover:border-indigo-900 hover:shadow-2xl transition-all group">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-tighter text-xs">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">{MODE_ICONS[container.mode]}</div>
                  <span>{container.mode} STRATEGIC ROUTE</span>
                </div>
                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  container.status === 'FULL' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {container.status === 'FULL' ? t.alreadyBooked : `${container.availableCapacity} CBM ${t.left}`}
                </span>
              </div>

              <div className="flex items-center justify-between mb-10">
                <div className="flex-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Origin Hub</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{container.origin}</div>
                </div>
                <div className="px-8 flex flex-col items-center opacity-30 group-hover:opacity-100 transition-opacity">
                   <div className="h-[2px] w-16 bg-indigo-200 dark:bg-indigo-800 relative">
                     <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                   </div>
                </div>
                <div className="text-right flex-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Destination Hub</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{container.destination}</div>
                </div>
              </div>

              {/* Utility Visuals */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-6 mb-10 border border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2">
                  <Globe size={12} /> {t.utilities} Profiling
                </h4>
                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                   <UtilityBar label={t.electricity} value={container.utilities.electricity} icon={Zap} color="bg-yellow-500" />
                   <UtilityBar label={t.water} value={container.utilities.water} icon={Droplets} color="bg-blue-500" />
                   <UtilityBar label={t.security} value={container.utilities.security} icon={ShieldCheck} color="bg-emerald-500" />
                   <UtilityBar label={t.connectivity} value={container.utilities.connectivity} icon={Globe} color="bg-indigo-500" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-8 px-2">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{t.price}</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-0.5"><IndianRupee size={18} />{container.pricePerCBM.toLocaleString()}</div>
                </div>
                <button 
                  onClick={() => startBooking(container)}
                  disabled={container.status === 'FULL'}
                  className={`px-10 py-5 rounded-[24px] font-black text-sm transition-all shadow-xl uppercase tracking-widest ${
                    container.status === 'FULL' 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none'
                  }`}
                >
                  {container.status === 'FULL' ? t.alreadyBooked : t.bookNow}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dealer-Style Booking Modal */}
      {selectedContainer && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[48px] w-full max-w-2xl p-10 md:p-12 relative shadow-2xl overflow-hidden border border-white/20">
            
            {/* Steps Progress */}
            <div className="flex justify-between mb-10 px-4">
               {['VERIFY', 'DETAILS', 'PAY'].map((step, idx) => {
                 const isActive = bookingStep === step;
                 const isCompleted = ['DETAILS', 'PAY', 'PROCESS', 'SUCCESS'].includes(bookingStep) && idx === 0 || 
                                     ['PAY', 'PROCESS', 'SUCCESS'].includes(bookingStep) && idx === 1;
                 return (
                   <div key={step} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isActive ? 'bg-indigo-600 text-white shadow-lg' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-widest hidden sm:block ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {step === 'VERIFY' ? 'Cargo' : step === 'DETAILS' ? 'Consignor' : 'Payment'}
                      </div>
                   </div>
                 );
               })}
            </div>

            {bookingStep === 'VERIFY' && (
              <div className="animate-in slide-in-from-bottom-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Review Slot Selection</h2>
                <p className="text-slate-500 font-medium mb-10">Securing shared space for route <span className="text-indigo-600 font-bold">{selectedContainer.origin} → {selectedContainer.destination}</span>.</p>
                <div className="space-y-4 mb-10">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl flex justify-between items-center border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-600 dark:text-slate-400">Total Freight (1 CBM)</span>
                    <span className="font-black text-xl text-slate-900 dark:text-white">₹{selectedContainer.pricePerCBM.toLocaleString()}</span>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl flex justify-between items-center border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-600 dark:text-slate-400">GST (18%)</span>
                    <span className="font-black text-xl text-slate-900 dark:text-white">₹{(selectedContainer.pricePerCBM * 0.18).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setSelectedContainer(null)} className="flex-1 py-5 rounded-2xl font-black text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Cancel</button>
                  <button onClick={() => setBookingStep('DETAILS')} className="flex-1 py-5 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest text-xs">Proceed to Details</button>
                </div>
              </div>
            )}

            {bookingStep === 'DETAILS' && (
              <div className="animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-6">
                   <button onClick={() => setBookingStep('VERIFY')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><ArrowLeft size={20}/></button>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t.personalDetails}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.fullName}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 dark:text-white text-sm"
                          placeholder="Ex: Rajesh Kumar"
                          value={form.name}
                          onChange={(e) => setForm({...form, name: e.target.value})}
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.phoneNumber}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="tel" 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 dark:text-white text-sm"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={(e) => setForm({...form, phone: e.target.value})}
                        />
                      </div>
                   </div>
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.businessAddress}</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 dark:text-white text-sm"
                          placeholder="Plot 45, MIDC Industrial Area, Mumbai"
                          value={form.address}
                          onChange={(e) => setForm({...form, address: e.target.value})}
                        />
                      </div>
                   </div>
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.gstin}</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 dark:text-white text-sm uppercase"
                          placeholder="27AAACV1234F1Z1"
                          value={form.gstin}
                          onChange={(e) => setForm({...form, gstin: e.target.value.toUpperCase()})}
                        />
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => setBookingStep('PAY')}
                  disabled={!isFormValid}
                  className="w-full py-5 rounded-3xl font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  {t.proceedPayment} <ChevronRight size={18} />
                </button>
              </div>
            )}

            {bookingStep === 'PAY' && (
              <div className="animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-6">
                   <button onClick={() => setBookingStep('DETAILS')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><ArrowLeft size={20}/></button>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t.chooseBank}</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                   {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map(bank => (
                     <button 
                       key={bank}
                       onClick={() => setSelectedBank(bank)}
                       className={`p-6 rounded-3xl border-2 text-left transition-all ${selectedBank === bank ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'}`}
                     >
                       <div className="text-sm font-black text-slate-800 dark:text-white">{bank}</div>
                       <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Net Banking / UPI</div>
                     </button>
                   ))}
                </div>
                <button 
                  onClick={handleFinalPayment}
                  disabled={!selectedBank}
                  className="w-full py-5 rounded-3xl font-black text-white bg-slate-900 dark:bg-indigo-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-2xl uppercase tracking-widest text-xs"
                >
                  <CreditCard size={20} /> {t.pay} (₹{(selectedContainer.pricePerCBM * 1.18).toLocaleString()})
                </button>
              </div>
            )}

            {bookingStep === 'PROCESS' && (
              <div className="text-center py-20 animate-pulse">
                <Loader2 size={64} className="mx-auto text-indigo-600 animate-spin mb-8" />
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Securing Your Space...</h2>
                <p className="text-slate-500 font-medium tracking-tight">Communicating with Central Port Authority Gateway</p>
              </div>
            )}

            {bookingStep === 'SUCCESS' && (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 dark:text-green-400">
                  <CheckCircle2 size={48} strokeWidth={3} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{t.confirmed}!</h2>
                <p className="text-slate-500 font-bold text-lg mb-8">Slot booked in Container ID: {selectedContainer.id}</p>
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl text-left border border-slate-100 dark:border-slate-800">
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Consignee Receipt Info</div>
                   <div className="grid grid-cols-2 gap-4 text-xs">
                      <div><span className="text-slate-400 block mb-1">Name</span> <span className="font-bold text-slate-800 dark:text-white">{form.name}</span></div>
                      <div><span className="text-slate-400 block mb-1">GSTIN</span> <span className="font-bold text-slate-800 dark:text-white">{form.gstin}</span></div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
