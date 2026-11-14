import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { useNavigate } from 'react-router-dom';
import { Ticket, ArrowRight, Lock, Mail, AlertCircle, User, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
        setError("Please enter a valid email address.");
        return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    if (login(email.trim())) {
      navigate('/');
    } else {
        setError("Unable to sign in. Please check your credentials.");
        setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'user' | 'admin') => {
      const demoEmail = role === 'admin' ? 'admin@example.com' : 'user@example.com';
      login(demoEmail);
      navigate(role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-4 lg:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden border border-gray-100 dark:border-slate-800">
        
        {/* Visual Side */}
        <div className="hidden lg:flex flex-col justify-between bg-slate-950 relative p-12 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-500/20 z-0"></div>
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
           
           <div className="relative z-10">
               <div className="flex items-center gap-2 text-white mb-8">
                   <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                       <Ticket className="w-6 h-6" />
                   </div>
                   <span className="font-bold text-xl tracking-tight">Nexus</span>
               </div>
               <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Your Passport to <br/>Global Experiences</h2>
               <p className="text-slate-400 text-lg max-w-sm">Secure, seamless, and premium ticketing for the modern era.</p>
           </div>

           <div className="relative z-10 space-y-4">
               {['Instant Booking', 'Secure Payments', '24/7 Support'].map((item) => (
                   <div key={item} className="flex items-center gap-3 text-slate-300">
                       <CheckCircle2 className="w-5 h-5 text-primary-500" />
                       <span className="font-medium">{item}</span>
                   </div>
               ))}
           </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {isSignUp ? 'Create an account' : 'Welcome back'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                  {isSignUp ? 'Enter your details below to get started.' : 'Please enter your details to sign in.'}
              </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                  <div>
                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                     <div className="relative group">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <input type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white placeholder-gray-400" />
                     </div>
                  </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white placeholder-gray-400"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {!isSignUp && (
                 <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                        <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</button>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white placeholder-gray-400" />
                    </div>
                 </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                        {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                    </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"} {' '}
                    <button 
                        onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                        className="text-primary-600 dark:text-primary-400 font-bold hover:underline focus:outline-none"
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
            
            <div className="my-8 relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-slate-800"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-gray-400 font-medium">Demo Accounts</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleDemoLogin('user')} className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-100 dark:border-slate-700">
                    User Demo
                </button>
                <button onClick={() => handleDemoLogin('admin')} className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-100 dark:border-slate-700">
                    Admin Demo
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};