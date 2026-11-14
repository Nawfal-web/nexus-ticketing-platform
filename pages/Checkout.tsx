import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { useNavigate } from 'react-router-dom';
import { Trash2, CreditCard, Lock, CheckCircle, AlertTriangle, ShieldCheck, ShoppingCart, Calendar } from 'lucide-react';

export const Checkout = () => {
  const { cart, events, removeFromCart, checkout, t, formatPrice, formatDate } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Payment State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const cartItems = cart.map((item, index) => {
    const event = events.find(e => e.id === item.eventId);
    return { ...item, event, cartIndex: index };
  }).filter(item => item.event);

  const total = cartItems.reduce((sum, item) => {
    const price = item.type === 'VIP' ? item.event!.priceVip : item.event!.priceRegular;
    return sum + (price * item.quantity);
  }, 0);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if(errors.cardNumber) setErrors({...errors, cardNumber: ''});
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 4);
    let formatted = val;
    if (val.length >= 2) {
      formatted = `${val.substring(0, 2)}/${val.substring(2)}`;
    }
    setExpiry(formatted);
    if(errors.expiry) setErrors({...errors, expiry: ''});
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    if (!cardName.trim()) newErrors.cardName = "Required";
    if (cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = "16 digits required";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) newErrors.expiry = "MM/YY";
    if (cvc.length < 3) newErrors.cvc = "3-4 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await checkout();
      if (result) {
          setSuccess(true);
          setTimeout(() => navigate('/my-tickets'), 2500);
      } else {
          alert("Booking failed. Please check availability.");
      }
    } catch (err) {
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-slate-800">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{t('checkout.empty')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">{t('checkout.emptyDesc')}</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/20">
            {t('checkout.browse')}
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500 animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{t('checkout.success')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{t('checkout.successDesc')}</p>
        <button onClick={() => navigate('/my-tickets')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
            {t('checkout.viewTickets')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('checkout.title')}</h1>
          <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">{cartItems.length} Items</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Order Summary */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm border border-gray-200 dark:border-slate-800">
              <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-green-500" />
                 <h2 className="font-semibold text-slate-900 dark:text-white">{t('checkout.summary')}</h2>
              </div>
              <div className="p-5 space-y-4">
                  {cartItems.map((item) => (
                     <div key={item.cartIndex} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border border-gray-100 dark:border-slate-800/50">
                        <img src={item.event!.image} alt="" className="w-20 h-20 rounded-lg object-cover shadow-sm" />
                        <div className="flex-grow flex flex-col justify-center min-w-0">
                           <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">{item.event!.title}</h3>
                           <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                               <Calendar className="w-3 h-3" /> {formatDate(item.event!.date)}
                           </p>
                           <div className="flex items-center gap-2">
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${item.type === 'VIP' ? 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400' : 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'}`}>
                                   {item.type}
                               </span>
                               <span className="text-xs font-medium text-gray-500 dark:text-gray-400">x {item.quantity}</span>
                           </div>
                        </div>
                        <div className="text-right flex flex-col justify-between items-end">
                            <span className="font-bold text-lg text-slate-900 dark:text-white">{formatPrice((item.type === 'VIP' ? item.event!.priceVip : item.event!.priceRegular) * item.quantity)}</span>
                            <button 
                              onClick={() => removeFromCart(item.cartIndex)}
                              className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                     </div>
                  ))}
              </div>
              <div className="p-6 bg-gray-50/50 dark:bg-slate-950/50 rounded-b-2xl border-t border-gray-200 dark:border-slate-800 flex justify-between items-center">
                  <div className="text-sm text-gray-500">{t('checkout.totalDue')}</div>
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatPrice(total)}</span>
              </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-200 dark:border-slate-800 sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <Lock className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('checkout.paymentDetails')}</h2>
                    <p className="text-xs text-gray-500">Encrypted & Secure</p>
                </div>
              </div>
              
              <form onSubmit={handlePayment} className="space-y-5" noValidate>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Cardholder Name</label>
                  <input 
                    type="text" 
                    value={cardName}
                    onChange={(e) => {setCardName(e.target.value); if(errors.cardName) setErrors({...errors, cardName: ''})}}
                    placeholder="John Doe" 
                    className={`w-full p-3 bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm dark:text-white ${errors.cardName ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-primary-500'}`}
                  />
                  {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Card Number</label>
                  <div className="relative">
                     <input 
                        type="text" 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000" 
                        maxLength={19}
                        className={`w-full p-3 pl-10 bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm font-mono dark:text-white ${errors.cardNumber ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-primary-500'}`} 
                     />
                     <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Expiry</label>
                    <input 
                        type="text" 
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY" 
                        maxLength={5}
                        className={`w-full p-3 bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm text-center dark:text-white ${errors.expiry ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-primary-500'}`}
                    />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">CVC</label>
                    <input 
                        type="text" 
                        value={cvc}
                        onChange={(e) => {setCvc(e.target.value.replace(/\D/g, '').substring(0,4)); if(errors.cvc) setErrors({...errors, cvc: ''})}}
                        placeholder="123" 
                        maxLength={4}
                        className={`w-full p-3 bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm text-center dark:text-white ${errors.cvc ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-primary-500'}`}
                    />
                    {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-xl font-bold mt-4 hover:shadow-lg transition-all flex justify-center items-center active:scale-[0.99]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    `${t('checkout.pay')} ${formatPrice(total)}`
                  )}
                </button>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
};