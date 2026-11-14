import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { TicketType, TicketStatus } from '../types';
import { Calendar, MapPin, Download, XCircle, Clock, QrCode, Ticket as TicketIcon, Armchair, AlertTriangle, Send } from 'lucide-react';

export const MyTickets = () => {
  const { tickets, user, events, requestRefund, t, formatDate, formatTime } = useStore();
  const [refundModal, setRefundModal] = useState<{isOpen: boolean, ticketId: string | null}>({isOpen: false, ticketId: null});
  const [refundReason, setRefundReason] = useState('');

  const myTickets = tickets.filter(t => t.userId === user?.id).sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

  const handleDownload = (ticketId: string) => {
      alert(`Downloading Ticket #${ticketId}`);
  };

  const openRefundModal = (ticketId: string) => {
      setRefundModal({ isOpen: true, ticketId });
      setRefundReason('');
  };

  const handleSubmitRefund = (e: React.FormEvent) => {
      e.preventDefault();
      if(refundModal.ticketId && refundReason.trim()) {
          requestRefund(refundModal.ticketId, refundReason);
          setRefundModal({ isOpen: false, ticketId: null });
          setRefundReason('');
      }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('myTickets.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('myTickets.manage')}</p>
        </div>
        <span className="text-sm font-medium bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">{myTickets.length} Total</span>
      </div>

      {myTickets.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700">
           <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <TicketIcon className="w-8 h-8" />
           </div>
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('myTickets.noTickets')}</h3>
           <p className="text-gray-500 mt-1">{t('myTickets.noTicketsDesc')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myTickets.map((ticket, idx) => {
             const event = events.find(e => e.id === ticket.eventId);
             if (!event) return null;

             const isPast = new Date(event.date) < new Date();
             const isRefunded = ticket.status === TicketStatus.REFUNDED;
             const isRefundRequested = ticket.status === TicketStatus.REFUND_REQUESTED;

             return (
               <div key={ticket.id} className={`group relative flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 animate-slide-up ${isRefunded ? 'opacity-60 grayscale' : ''}`} style={{animationDelay: `${idx * 0.1}s`}}>
                 
                 {/* Left Side: Event Image */}
                 <div className="md:w-64 relative h-48 md:h-auto overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 backdrop-blur-md shadow-lg ${ticket.type === TicketType.VIP ? 'bg-secondary-600/90' : 'bg-primary-600/90'}`}>
                            {ticket.type}
                        </span>
                    </div>
                 </div>

                 {/* Middle: Details */}
                 <div className="flex-1 p-6 flex flex-col justify-between relative border-r border-dashed border-gray-200 dark:border-slate-700">
                    <div className="hidden md:block absolute -top-3 -right-3 w-6 h-6 bg-gray-50 dark:bg-slate-950 rounded-full z-10 border-b border-gray-200 dark:border-slate-800"></div>
                    <div className="hidden md:block absolute -bottom-3 -right-3 w-6 h-6 bg-gray-50 dark:bg-slate-950 rounded-full z-10 border-t border-gray-200 dark:border-slate-800"></div>

                    <div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{event.title}</h3>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-500 dark:text-gray-400">
                             <div className="flex items-center gap-2">
                                 <Calendar className="w-4 h-4 text-primary-500" />
                                 {formatDate(event.date)}
                             </div>
                             <div className="flex items-center gap-2">
                                 <Clock className="w-4 h-4 text-primary-500" />
                                 {formatTime(event.date)}
                             </div>
                             <div className="flex items-center gap-2">
                                 <MapPin className="w-4 h-4 text-primary-500" />
                                 <span className="truncate">{event.location}</span>
                             </div>
                             {ticket.seat && (
                                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                                    <Armchair className="w-4 h-4 text-primary-500" />
                                    {ticket.seat}
                                </div>
                             )}
                        </div>
                    </div>
                    
                    <div className="mt-5 flex items-center gap-4">
                         {(!isRefunded && !isRefundRequested && !isPast) && (
                             <button 
                                onClick={() => openRefundModal(ticket.id)}
                                className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1.5"
                            >
                                <AlertTriangle className="w-3.5 h-3.5" /> {t('myTickets.refund')}
                            </button>
                         )}
                         {isRefundRequested && (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase border border-yellow-200 dark:border-yellow-900/30">
                                 <Clock className="w-3.5 h-3.5" /> {t('myTickets.pending')}
                             </span>
                         )}
                         {isRefunded && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-bold uppercase">{t('myTickets.refunded')}</span>}
                         {isPast && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 text-xs font-bold uppercase">{t('myTickets.ended')}</span>}
                    </div>
                 </div>

                 {/* Right Side: QR Stub */}
                 <div className="md:w-48 bg-gray-50/50 dark:bg-slate-900/50 p-6 flex flex-col items-center justify-center relative">
                    <div className="hidden md:block absolute -top-3 -left-3 w-6 h-6 bg-gray-50 dark:bg-slate-950 rounded-full z-10 border-b border-gray-200 dark:border-slate-800"></div>
                    <div className="hidden md:block absolute -bottom-3 -left-3 w-6 h-6 bg-gray-50 dark:bg-slate-950 rounded-full z-10 border-t border-gray-200 dark:border-slate-800"></div>

                    {(!isRefunded && !isPast && !isRefundRequested) ? (
                        <>
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-200 mb-3">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`} 
                                    alt="QR Code" 
                                    className="w-20 h-20 mix-blend-multiply"
                                />
                            </div>
                            <p className="text-[10px] font-mono text-gray-400 text-center truncate w-full px-2 mb-3">{ticket.id.slice(0, 12)}...</p>
                            <button 
                                onClick={() => handleDownload(ticket.id)}
                                className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            >
                                <Download className="w-3 h-3" /> {t('myTickets.download')}
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                             <QrCode className="w-12 h-12 opacity-20 mb-2" />
                             <span className="text-xs font-medium">Not Available</span>
                        </div>
                    )}
                 </div>
               </div>
             );
          })}
        </div>
      )}

      {/* Refund Request Modal */}
      {refundModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRefundModal({isOpen: false, ticketId: null})}></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 p-6 animate-slide-up">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('myTickets.refund')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please tell us why you are cancelling your ticket. This will be reviewed by an administrator.</p>
                  
                  <form onSubmit={handleSubmitRefund}>
                      <textarea 
                        required
                        className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm mb-4 dark:text-white resize-none"
                        rows={4}
                        placeholder="Reason for cancellation..."
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                      ></textarea>
                      <div className="flex gap-3">
                          <button 
                            type="button" 
                            onClick={() => setRefundModal({isOpen: false, ticketId: null})}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                          >
                              <Send className="w-4 h-4" /> Submit
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};