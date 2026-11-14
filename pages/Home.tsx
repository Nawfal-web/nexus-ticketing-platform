import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/Store';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, Filter, SlidersHorizontal, ArrowRight, X, Clock } from 'lucide-react';
import { EventCategory, Event } from '../types';

export const Home = () => {
  const { events, searchEvents, t, formatPrice, formatDate, formatTime } = useStore();
  
  // Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination State
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const EVENTS_PER_PAGE = 9; // Increased for better grid fill
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredEvents = searchEvents(searchTerm).filter(e => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesPrice = e.priceRegular >= priceRange[0] && e.priceRegular <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  useEffect(() => {
    const newEvents = filteredEvents.slice(0, page * EVENTS_PER_PAGE);
    setDisplayedEvents(newEvents);
  }, [page, filteredEvents, searchTerm, selectedCategory, priceRange]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, priceRange]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && displayedEvents.length < filteredEvents.length) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 1.0 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [displayedEvents, filteredEvents]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 relative py-16 lg:py-24">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -z-10 animate-blob"></div>
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Live Events & Experiences
         </div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1] animate-slide-up">
          {t('home.hero.title')} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">{t('home.hero.subtitle')}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
          {t('home.hero.desc')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* Filters Sidebar */}
        <div className={`
            lg:w-72 w-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 lg:sticky lg:top-24 z-30 transition-all
            ${showFilters ? 'block shadow-2xl' : 'hidden lg:block'}
        `}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary-500" /> {t('filters.title')}
                </h3>
                <button 
                    onClick={() => {setPriceRange([0, 1000]); setSelectedCategory('All'); setSearchTerm('')}} 
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                    {t('filters.reset')}
                </button>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('filters.category')}</label>
                    <div className="space-y-1">
                        {['All', ...Object.values(EventCategory)].map(cat => (
                             <label key={cat} className="flex items-center gap-3 cursor-pointer group py-1">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedCategory === cat ? 'border-primary-500' : 'border-gray-300 dark:border-slate-600 group-hover:border-primary-400'}`}>
                                    {selectedCategory === cat && <div className="w-2 h-2 rounded-full bg-primary-500"></div>}
                                </div>
                                <input 
                                    type="radio" 
                                    name="category" 
                                    className="hidden"
                                    checked={selectedCategory === cat}
                                    onChange={() => setSelectedCategory(cat)}
                                />
                                <span className={`text-sm transition-colors ${selectedCategory === cat ? 'text-slate-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                    {cat === 'All' ? t('filters.all') : cat}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('filters.price')}</label>
                    <div className="flex gap-3 items-center mb-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input 
                                type="number" 
                                value={priceRange[0]} 
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="w-full pl-6 pr-2 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <span className="text-gray-300">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input 
                                type="number" 
                                value={priceRange[1]} 
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="w-full pl-6 pr-2 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
            {/* Search Bar */}
            <div className="flex gap-3 mb-8">
                <div className="relative flex-grow group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-600 dark:text-gray-300 shadow-sm"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedEvents.map((event, idx) => (
                  <Link 
                    key={event.id} 
                    to={`/event/${event.id}`} 
                    className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${(idx % 3) * 0.05}s` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-3 left-3">
                         <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm text-xs font-semibold text-slate-900 dark:text-white border border-white/20 shadow-sm">
                            {event.category}
                         </span>
                      </div>
                      {event.availableSeats === 0 && (
                           <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
                             <span className="px-4 py-1 border border-white/30 text-white text-sm font-bold uppercase tracking-widest rounded-full">{t('event.soldOut')}</span>
                           </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                         <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary-500"/> {formatDate(event.date)}</span>
                         <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary-500"/> {formatTime(event.date)}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0"/> {event.location}
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Price</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(event.priceRegular)}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            
            {/* Empty State / Loader */}
            <div ref={loaderRef} className="py-12 text-center">
                {displayedEvents.length < filteredEvents.length && (
                    <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                )}
                {filteredEvents.length === 0 && (
                   <div className="py-16 px-6 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                     <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-gray-400" />
                     </div>
                     <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No events found</h3>
                     <p className="text-gray-500 text-sm">We couldn't find any matches. Try adjusting your filters.</p>
                     <button onClick={() => {setPriceRange([0, 1000]); setSelectedCategory('All'); setSearchTerm('')}} className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">Clear filters</button>
                   </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};