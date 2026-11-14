import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/Store';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export const ChatAssistant = () => {
  const { events, formatDate, formatTime } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hello! I\'m your Nexus assistant. Need help finding an event?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const eventContext = events.map(e => `${e.title} (${e.category}) on ${formatDate(e.date)} at ${formatTime(e.date)} at ${e.location}. Price: $${e.priceRegular}.`).join('\n');
    const responseText = await chatWithAI(input, eventContext);

    const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all z-40 ${isOpen ? 'hidden' : 'flex'} items-center gap-2 group`}
        aria-label="Open Chat"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="font-bold hidden md:inline pr-2">Assistant</span>
      </button>

      {isOpen && (
        <div 
            className="fixed bottom-6 right-6 w-[90vw] md:w-[380px] h-[550px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-black/20 border border-gray-100 dark:border-slate-800 flex flex-col z-50 overflow-hidden animate-slide-up"
            role="dialog"
        >
          {/* Header */}
          <div className="p-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Bot className="w-6 h-6" />
              </div>
              <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">Nexus AI</h2>
                  <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-gray-500">Online</span>
                  </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50 dark:bg-slate-950/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-gray-100 dark:border-slate-700 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start">
                   <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-slate-700 shadow-sm">
                       <div className="flex gap-1.5">
                           <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                           <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                           <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                       </div>
                   </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
            <div className="relative flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about events..."
                  className="flex-1 p-3.5 bg-gray-100 dark:bg-slate-800 border-transparent focus:border-primary-500 focus:ring-0 rounded-xl text-sm text-slate-900 dark:text-white transition-all outline-none placeholder-gray-400"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isTyping} 
                    className="p-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};