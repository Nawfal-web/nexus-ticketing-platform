import React from 'react';
import { Search, HelpCircle, FileText, CreditCard, MessageCircle, ChevronRight, User, Ticket } from 'lucide-react';

export const HelpCenter = () => {
  const categories = [
    { icon: Ticket, title: 'Buying Tickets', desc: 'How to purchase, delivery, and fees.' },
    { icon: CreditCard, title: 'Payments & Refunds', desc: 'Payment methods, receipts, and cancellation policy.' },
    { icon: User, title: 'Account Settings', desc: 'Password reset, profile updates, and preferences.' },
    { icon: FileText, title: 'Event Organizers', desc: 'Creating events, managing attendees, and payouts.' },
  ];

  const faqs = [
    { q: 'How do I access my tickets?', a: 'After purchase, tickets are sent to your email and are also available in the "My Tickets" section of your account.' },
    { q: 'Can I get a refund?', a: 'Refunds are available if requested at least 48 hours before the event start time. You can request a refund from the "My Tickets" page.' },
    { q: 'Is it safe to buy tickets here?', a: 'Yes, Nexus Tickets uses secure encryption for all payments and guarantees valid tickets for all listed events.' },
    { q: 'How do I transfer a ticket?', a: 'Currently, ticket transfers must be handled by our support team. Please contact us with your order details.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Hero Search */}
      <div className="bg-slate-900 text-center py-20 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-primary-600/10 z-0"></div>
         <div className="relative z-10 max-w-2xl mx-auto">
             <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">How can we help?</h1>
             <div className="relative">
                 <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Search for answers..." 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-primary-500 transition-all shadow-lg"
                 />
             </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {categories.map((cat, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all group cursor-pointer">
                      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                          <cat.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{cat.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{cat.desc}</p>
                  </div>
              ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                  {faqs.map((faq, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-900/50 transition-colors">
                          <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                              {faq.q}
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-20 text-center bg-primary-50 dark:bg-primary-900/10 rounded-3xl p-10 border border-primary-100 dark:border-primary-900/30">
              <MessageCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Still need help?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Our support team is available 24/7 to assist you.</p>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20">
                  Contact Support
              </button>
          </div>
      </div>
    </div>
  );
};