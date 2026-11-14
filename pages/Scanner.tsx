import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';
import { Ticket } from '../types';

export const TicketScanner = () => {
  const { verifyTicket } = useStore();
  const [inputId, setInputId] = useState('');
  const [result, setResult] = useState<{valid: boolean; message: string; ticket?: Ticket} | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if(!inputId) return;
    
    // In a real app, this would be triggered by a camera library like react-qr-reader
    const res = verifyTicket(inputId);
    setResult(res);
    setInputId('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
           <QrCode className="w-10 h-10 text-primary-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ticket Scanner</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Enter Ticket ID to simulate scanning.</p>

        <form onSubmit={handleScan} className="mb-8">
           <input 
             type="text" 
             placeholder="Enter Ticket ID (e.g. tkt-123...)" 
             value={inputId}
             onChange={e => setInputId(e.target.value)}
             className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl text-center font-mono text-lg outline-none focus:border-primary-500 mb-4 dark:text-white"
           />
           <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg">
             Verify Ticket
           </button>
        </form>

        {result && (
          <div className={`p-6 rounded-xl border-l-4 text-left animation-fade-in ${result.valid ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-red-500'}`}>
             <div className="flex items-center gap-3 mb-2">
                {result.valid ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                <h3 className={`font-bold text-lg ${result.valid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {result.message}
                </h3>
             </div>
             {result.ticket && (
                 <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 pl-9 space-y-1">
                    <p>ID: <span className="font-mono">{result.ticket.id}</span></p>
                    <p>Type: <span className="font-bold">{result.ticket.type}</span></p>
                    <p>User: {result.ticket.userId}</p>
                    {result.ticket.seat && <p>Seat: <span className="font-bold text-slate-900 dark:text-white">{result.ticket.seat}</span></p>}
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};