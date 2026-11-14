import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/Store';
import { Calendar, MapPin, Ticket, Check, AlertCircle, Info, Clock, ArrowLeft } from 'lucide-react';
import { TicketType } from '../types';

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { events, addToCart, user, t, formatPrice, formatDate, formatTime } = useStore();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);

  const [selectedType, setSelectedType] = useState<TicketType>(TicketType.REGULAR);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!event) return <div className="min-h-screen flex items-center justify-center text-gray-500">Event not found</div>;

  const isSoldOut = event.availableSeats === 0;

  const handleAddToCart = () => {
    if(!user) {
        navigate('/login');
        return;
    }
    addToCart(event.id, selectedType, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const currentPrice = selectedType === TicketType.VIP ? event.priceVip : event.priceRegular;
  const totalPrice = currentPrice * quantity;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20">
      {/* Immersive Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-slate-950 via-transparent to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <button onClick={() => navigate(-1)} className="absolute top-8 left-4 sm:left-8 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="animate-slide-up">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-600/90 text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-primary-900/20">
                        {event.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight max-w-4xl">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap gap-y-4 gap-x-8 text-white/90 text-sm md:text-base font-medium">
                        <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-400"/> {formatDate(event.date, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
                        <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary-400"/> {formatTime(event.date)}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-400"/> {event.location}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-12">
            <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-500" /> {t('event.about')}
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                <p>{event.description}</p>
                <p className="mt-4">Join us for an unforgettable experience! This event features top-tier entertainment, exclusive access for VIPs, and a vibrant atmosphere. Don't miss out on what promises to be one of the highlights of the year. Secure your tickets now and be part of the excitement.</p>
              </div>
            </section>
            
            <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" /> {t('event.venue')}
              </h2>
              <div className="bg-gray-100 dark:bg-slate-900 rounded-2xl h-80 flex items-center justify-center relative overflow-hidden group border border-gray-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"></div>
                <div className="relative z-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md p-6 rounded-xl shadow-lg text-center border border-white/20">
                    <MapPin className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{event.location}</p>
                    <p className="text-sm text-gray-500">Directions & Parking Info</p>
                </div>
              </div>
            </section>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-4">
             <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-200 dark:border-slate-800 sticky top-24 animate-slide-up" style={{ animationDelay: '0.3s' }}>
               <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('event.selectTickets')}</h3>
                    {event.availableSeats < 50 && event.availableSeats > 0 && (
                        <span className="text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded-md border border-orange-200 dark:border-orange-900">
                            {t('event.onlyLeft', {n: event.availableSeats})}
                        </span>
                    )}
               </div>
               
               {isSoldOut ? (
                  <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-xl text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <h4 className="font-bold text-red-700 dark:text-red-400">{t('event.soldOut')}</h4>
                    <p className="text-sm text-red-600 dark:text-red-500/80 mt-1">Join the waitlist to get notified.</p>
                  </div>
               ) : (
                 <>
                   <div className="space-y-3 mb-8">
                     <button
                       onClick={() => setSelectedType(TicketType.REGULAR)}
                       className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedType === TicketType.REGULAR ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'}`}
                     >
                       <div className="text-left">
                         <div className="font-bold text-slate-900 dark:text-white">{t('event.regular')}</div>
                         <div className="text-xs text-gray-500">General admission</div>
                       </div>
                       <div className="font-bold text-slate-900 dark:text-white text-lg">{formatPrice(event.priceRegular)}</div>
                     </button>
                     
                     <button
                       onClick={() => setSelectedType(TicketType.VIP)}
                       className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedType === TicketType.VIP ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'}`}
                     >
                       <div className="text-left">
                         <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">{t('event.vip')} <span className="text-[10px] bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 px-1.5 py-0.5 rounded uppercase tracking-wide">Best Value</span></div>
                         <div className="text-xs text-gray-500">Premium seating + perks</div>
                       </div>
                       <div className="font-bold text-slate-900 dark:text-white text-lg">{formatPrice(event.priceVip)}</div>
                     </button>
                   </div>
    
                   <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('event.quantity')}</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium">-</button>
                        <span className="font-bold w-4 text-center text-slate-900 dark:text-white">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium">+</button>
                      </div>
                   </div>
    
                   <div className="border-t border-gray-100 dark:border-slate-800 pt-6 mb-6">
                     <div className="flex justify-between items-end">
                       <span className="text-sm text-gray-500">{t('event.total')}</span>
                       <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{formatPrice(totalPrice)}</span>
                     </div>
                   </div>
    
                   <button
                     onClick={handleAddToCart}
                     disabled={added}
                     className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg ${
                         added 
                         ? 'bg-green-500 shadow-green-500/20' 
                         : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/25'
                     }`}
                   >
                     {added ? (
                       <><Check className="w-5 h-5" /> {t('event.added')}</>
                     ) : (
                       <><Ticket className="w-5 h-5" /> {t('event.add')}</>
                     )}
                   </button>
                   <p className="text-center text-xs text-gray-400 mt-4">Secure checkout powered by Nexus</p>
                 </>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};