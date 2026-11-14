import React, { useState, useEffect } from 'react';
import { useStore } from '../context/Store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Ticket, LogOut, ShoppingCart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Settings, Globe, Calendar as CalendarIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, theme, toggleTheme, cart, isAdmin, language, setLanguage, currency, setCurrency, t } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: t('nav.events'), path: '/' },
    { name: t('nav.calendar'), path: '/calendar' },
    ...(user ? [{ name: t('nav.myTickets'), path: '/my-tickets' }] : []),
    ...(isAdmin ? [{ name: t('nav.admin'), path: '/admin' }] : []),
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'CNY' : 'USD');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-gray-200 dark:border-slate-800 shadow-sm' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg p-1">
            <div className="bg-gradient-to-tr from-primary-600 to-primary-500 p-1.5 rounded-lg shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Nexus</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === link.path 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
             <div className="flex items-center gap-1 border-r border-gray-200 dark:border-slate-800 pr-3 mr-1">
                <button 
                  onClick={toggleLanguage}
                  className="px-2 py-1.5 text-xs font-bold rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors uppercase"
                >
                  {language === 'en' ? 'EN' : '中'}
                </button>
                <button 
                  onClick={toggleCurrency}
                  className="px-2 py-1.5 text-xs font-bold rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors uppercase"
                >
                  {currency === 'USD' ? '$' : '¥'}
                </button>
             </div>

             {user && !isAdmin && (
               <Link to="/checkout" aria-label={`Cart with ${cart.length} items`} className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                 <ShoppingCart className="h-5 w-5" />
                 {cart.length > 0 && (
                   <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                    </span>
                 )}
               </Link>
             )}

            <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                   <img src={user.avatar} alt="" className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" />
                   <div className="hidden lg:block">
                      <p className="text-xs font-medium text-slate-900 dark:text-white leading-none">{user.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.role}</p>
                   </div>
                </div>
                <div className="flex gap-1">
                   <Link to="/settings" className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800" title={t('nav.settings')}>
                     <Settings className="h-4 w-4" />
                   </Link>
                   <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20" title={t('nav.logout')}>
                     <LogOut className="h-4 w-4" />
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.login')}</Link>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm shadow-primary-500/20 transition-all hover:translate-y-px">{t('nav.signup')}</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
             {user && !isAdmin && (
               <Link to="/checkout" className="relative text-gray-500 dark:text-gray-400">
                 <ShoppingCart className="h-5 w-5" />
                 {cart.length > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary-500 rounded-full"></span>}
               </Link>
             )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 shadow-xl animate-slide-up">
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === link.path 
                    ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
             <div className="flex gap-2 mb-4">
               <button onClick={toggleLanguage} className="flex-1 py-2 text-sm border rounded bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  {language === 'en' ? 'English' : '中文'}
               </button>
               <button onClick={toggleCurrency} className="flex-1 py-2 text-sm border rounded bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  {currency}
               </button>
             </div>
            {user ? (
              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <LogOut className="h-5 w-5" />
                    </button>
                 </div>
                 <Link 
                   to="/settings" 
                   onClick={() => setIsMenuOpen(false)} 
                   className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
                 >
                   <Settings className="h-4 w-4" /> {t('nav.settings')}
                 </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                 <Link to="/login" className="flex justify-center py-3 rounded-xl border border-gray-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200">{t('nav.login')}</Link>
                 <Link to="/login" className="flex justify-center py-3 rounded-xl bg-primary-600 text-white font-medium shadow-lg shadow-primary-500/20">{t('nav.signup')}</Link>
              </div>
            )}
            <div className="mt-4 flex justify-between items-center">
                 <span className="text-sm text-gray-500">Theme</span>
                 <button onClick={toggleTheme} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                 </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer = () => {
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' }
  ];

  const { t } = useStore();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="bg-primary-600 p-1.5 rounded-lg">
                <Ticket className="h-5 w-5 text-white" />
               </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Nexus</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              The premier platform for discovering and securing access to the world's most exclusive events.
            </p>
            <div className="flex gap-3">
               {socialLinks.map(({ icon: Icon, label, href }) => (
                 <a 
                   key={label} 
                   href={href} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   aria-label={label}
                   className="p-2 bg-gray-50 dark:bg-slate-900 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-900"
                 >
                   <Icon className="w-4 h-4" />
                 </a>
               ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('nav.events')}</Link></li>
              <li><Link to="/calendar" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('nav.calendar')}</Link></li>
              <li><Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('nav.login')}</Link></li>
              <li><Link to="/my-tickets" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('nav.myTickets')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/help" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
             <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contact</h3>
             <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-500" /> <span>support@nexus.com</span></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-500" /> <span>+86 138 6712 9088</span></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary-500 mt-0.5" /> <span>Xiasha District,<br/>Hangzhou, China</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">&copy; 2025 Nexus Tickets. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-400">
             <Link to="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy</Link>
             <Link to="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300">Cookies</Link>
             <Link to="/terms" className="hover:text-slate-600 dark:hover:text-slate-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};