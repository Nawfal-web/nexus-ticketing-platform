import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

export const EventsCalendar = () => {
  const { events, t, formatTime } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getEventsForDay = (day: number) => {
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const [selectedDayEvents, setSelectedDayEvents] = useState<any[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
           <CalendarIcon className="w-8 h-8 text-primary-500" />
           {t('nav.calendar')}
        </h1>
        
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <span className="text-lg font-bold w-40 text-center text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-200 dark:border-slate-800 overflow-hidden">
             <div className="grid grid-cols-7 bg-gray-50 dark:bg-slate-950/50 border-b border-gray-200 dark:border-slate-800">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="py-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
             </div>
             
             <div className="grid grid-cols-7 auto-rows-[120px]">
                {blanks.map(x => <div key={`blank-${x}`} className="bg-gray-50/30 dark:bg-slate-900/30 border-r border-b border-gray-100 dark:border-slate-800/50"></div>)}
                
                {daysArray.map(day => {
                   const dayEvents = getEventsForDay(day);
                   const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                   const isSelected = selectedDate === day;

                   return (
                     <div 
                       key={day} 
                       onClick={() => { setSelectedDayEvents(dayEvents); setSelectedDate(day); }}
                       className={`relative p-2 border-r border-b border-gray-100 dark:border-slate-800 transition-all cursor-pointer hover:bg-primary-50 dark:hover:bg-slate-800/50 ${isSelected ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                     >
                       <span className={`absolute top-2 left-2 w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                         {day}
                       </span>
                       
                       <div className="mt-8 space-y-1">
                          {dayEvents.slice(0, 3).map(e => (
                             <div key={e.id} className="text-[10px] truncate px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                                {e.title}
                             </div>
                          ))}
                          {dayEvents.length > 3 && (
                             <div className="text-[10px] text-gray-500 pl-1">+ {dayEvents.length - 3} more</div>
                          )}
                       </div>
                     </div>
                   );
                })}
             </div>
          </div>

          {/* Sidebar / Details */}
          <div className="lg:col-span-1">
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-200 dark:border-slate-800 h-full flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
                   {selectedDate ? `${monthNames[month]} ${selectedDate}, ${year}` : "Select a date"}
                </h3>
                
                {!selectedDate && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                        <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p>Click on a date to view events</p>
                    </div>
                )}

                {selectedDate && selectedDayEvents && selectedDayEvents.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                        <p>No events scheduled for this day.</p>
                    </div>
                )}

                <div className="space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar">
                   {selectedDayEvents?.map(event => (
                      <Link to={`/event/${event.id}`} key={event.id} className="block group">
                        <div className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                           <img src={event.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                           <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">{event.title}</h4>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                 <Clock className="w-3 h-3" />
                                 {formatTime(event.date)}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                 <MapPin className="w-3 h-3" />
                                 <span className="truncate">{event.location}</span>
                              </div>
                           </div>
                        </div>
                      </Link>
                   ))}
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};