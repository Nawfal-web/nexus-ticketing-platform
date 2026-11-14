import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Event, Ticket, TicketStatus, UserRole, Booking, TicketType } from '../types';
import { MOCK_EVENTS, MOCK_USERS } from '../constants';

export type Language = 'en' | 'zh';
export type Currency = 'USD' | 'CNY';

const TRANSLATIONS = {
  en: {
    "nav.events": "Events",
    "nav.calendar": "Calendar",
    "nav.myTickets": "My Tickets",
    "nav.admin": "Admin",
    "nav.login": "Log in",
    "nav.signup": "Sign up",
    "nav.logout": "Sign Out",
    "nav.settings": "Settings",
    "home.hero.title": "Discover Your Next",
    "home.hero.subtitle": "Unforgettable Moment",
    "home.hero.desc": "Curated access to the world's most anticipated concerts, conferences, and cultural events.",
    "filters.title": "Filters",
    "filters.reset": "Reset",
    "filters.category": "Category",
    "filters.price": "Price Range",
    "filters.all": "All Events",
    "search.placeholder": "Search events by name, location, or artist...",
    "event.about": "About this Event",
    "event.venue": "Venue & Location",
    "event.selectTickets": "Select Tickets",
    "event.regular": "Regular",
    "event.vip": "VIP",
    "event.quantity": "Quantity",
    "event.total": "Total Price",
    "event.add": "Add to Cart",
    "event.added": "Added",
    "event.soldOut": "Sold Out",
    "event.onlyLeft": "Only {n} left",
    "checkout.title": "Checkout",
    "checkout.summary": "Order Summary",
    "checkout.empty": "Your cart is empty",
    "checkout.pay": "Pay",
    "checkout.paymentDetails": "Payment Details",
    "checkout.totalDue": "Total Due",
    "checkout.browse": "Browse Events",
    "checkout.emptyDesc": "Looks like you haven't added any tickets yet.",
    "checkout.success": "Payment Successful",
    "checkout.successDesc": "Your tickets have been secured and sent to your email.",
    "checkout.viewTickets": "View My Tickets",
    "myTickets.title": "My Tickets",
    "myTickets.manage": "Manage your upcoming events and bookings",
    "myTickets.download": "Save",
    "myTickets.refund": "Request Refund",
    "myTickets.refunded": "Refunded",
    "myTickets.pending": "Refund Pending",
    "myTickets.ended": "Event Ended",
    "myTickets.noTickets": "No tickets found",
    "myTickets.noTicketsDesc": "You haven't booked any events yet.",
    "common.loading": "Loading...",
  },
  zh: {
    "nav.events": "活动",
    "nav.calendar": "日历",
    "nav.myTickets": "我的门票",
    "nav.admin": "管理",
    "nav.login": "登录",
    "nav.signup": "注册",
    "nav.logout": "退出",
    "nav.settings": "设置",
    "home.hero.title": "探索您的下一个",
    "home.hero.subtitle": "难忘时刻",
    "home.hero.desc": "精选全球最受期待的音乐会、会议和文化活动。",
    "filters.title": "筛选",
    "filters.reset": "重置",
    "filters.category": "类别",
    "filters.price": "价格范围",
    "filters.all": "所有活动",
    "search.placeholder": "按名称、地点或艺术家搜索...",
    "event.about": "关于此活动",
    "event.venue": "场地与位置",
    "event.selectTickets": "选择门票",
    "event.regular": "普通票",
    "event.vip": "VIP票",
    "event.quantity": "数量",
    "event.total": "总价",
    "event.add": "加入购物车",
    "event.added": "已添加",
    "event.soldOut": "已售罄",
    "event.onlyLeft": "仅剩 {n} 张",
    "checkout.title": "结账",
    "checkout.summary": "订单摘要",
    "checkout.empty": "您的购物车是空的",
    "checkout.pay": "支付",
    "checkout.paymentDetails": "支付详情",
    "checkout.totalDue": "应付总额",
    "checkout.browse": "浏览活动",
    "checkout.emptyDesc": "看来您还没有添加任何门票。",
    "checkout.success": "支付成功",
    "checkout.successDesc": "您的门票已锁定并发送至您的邮箱。",
    "checkout.viewTickets": "查看我的门票",
    "myTickets.title": "我的门票",
    "myTickets.manage": "管理您即将参加的活动和预订",
    "myTickets.download": "保存",
    "myTickets.refund": "申请退款",
    "myTickets.refunded": "已退款",
    "myTickets.pending": "退款处理中",
    "myTickets.ended": "活动结束",
    "myTickets.noTickets": "未找到门票",
    "myTickets.noTicketsDesc": "您尚未预订任何活动。",
    "common.loading": "加载中...",
  }
};

interface StoreContextType {
  // Auth
  user: User | null;
  users: User[]; // All users list for admin
  login: (email: string) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Events
  events: Event[];
  searchEvents: (query: string) => Event[];
  addEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (event: Event) => void;
  
  // Booking & Tickets
  tickets: Ticket[];
  bookings: Booking[];
  bookTickets: (eventId: string, type: TicketType, quantity: number) => Promise<boolean>;
  checkout: () => Promise<boolean>;
  requestRefund: (ticketId: string, reason: string) => void;
  processRefund: (ticketId: string, approved: boolean) => void;
  verifyTicket: (ticketId: string) => { valid: boolean; message: string; ticket?: Ticket };
  
  // UI
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cart: { eventId: string; type: TicketType; quantity: number }[];
  addToCart: (eventId: string, type: TicketType, quantity: number) => void;
  clearCart: () => void;
  removeFromCart: (index: number) => void;

  // I18n & Currency
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
  formatPrice: (amount: number) => string;
  formatDate: (dateInput: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (dateInput: string | Date) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'nexus_user',
  ALL_USERS: 'nexus_all_users',
  EVENTS: 'nexus_events',
  TICKETS: 'nexus_tickets',
  BOOKINGS: 'nexus_bookings',
  THEME: 'nexus_theme',
  CART: 'nexus_cart',
  LANGUAGE: 'nexus_language',
  CURRENCY: 'nexus_currency'
};

const generateSeat = (totalSeats: number, availableSeats: number, index: number): string => {
  // Simple algorithm to simulate seat assignment
  const alreadySold = totalSeats - availableSeats;
  const currentSeat = alreadySold + index + 1;
  
  const seatsPerRow = 20;
  const rowIndex = Math.floor((currentSeat - 1) / seatsPerRow);
  const rowLetter = String.fromCharCode(65 + (rowIndex % 26)); 
  const rowNumber = rowIndex >= 26 ? Math.floor(rowIndex / 26) + 1 : ''; 
  const seatNumber = ((currentSeat - 1) % seatsPerRow) + 1;
  
  return `Row ${rowLetter}${rowNumber} - Seat ${seatNumber}`;
};

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize state from LocalStorage if available
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      return saved ? JSON.parse(saved) : MOCK_USERS;
    } catch (e) { return MOCK_USERS; }
  });

  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : MOCK_EVENTS;
    } catch (e) { return MOCK_EVENTS; }
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return (saved as 'light' | 'dark') || 'light';
    } catch (e) { return 'light'; }
  });

  const [cart, setCart] = useState<{ eventId: string; type: TicketType; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language) || 'en';
    } catch { return 'en'; }
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.CURRENCY) as Currency) || 'USD';
    } catch { return 'USD'; }
  });

  // Persistence Effects
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, curr);
  };

  const t = (key: string, params?: { [key: string]: string | number }): string => {
    const langDict = TRANSLATIONS[language] as Record<string, string>;
    let text = langDict[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const formatPrice = (amount: number): string => {
    if (currency === 'CNY') {
      return `¥${(amount * 7.2).toFixed(0)}`;
    }
    return `$${amount}`;
  };

  const formatDate = (dateInput: string | Date, options?: Intl.DateTimeFormatOptions) => {
    const date = new Date(dateInput);
    const locale = language === 'zh' ? 'zh-CN' : 'en-US';
    const defaultOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(locale, options || defaultOptions);
  };

  const formatTime = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    const locale = language === 'zh' ? 'zh-CN' : 'en-US';
    return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: language !== 'zh'
    });
  };

  const login = (emailInput: string): boolean => {
    const email = emailInput.trim().toLowerCase();
    if (!email.includes('@')) return false; 
    
    // Check if user exists in our persisted list
    const existingUser = users.find(u => u.email.toLowerCase() === email);
    if (existingUser) {
      setUser(existingUser);
      return true;
    }

    // "Sign Up" flow - Create new user
    if (email.includes('admin') && !email.includes('example.com')) {
       return false; // Very basic security simulation
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: UserRole.USER,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    // Also update in the main users list
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const searchEvents = (query: string) => {
    return events.filter(e => 
      e.title.toLowerCase().includes(query.toLowerCase()) || 
      e.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const addToCart = (eventId: string, type: TicketType, quantity: number) => {
    setCart(prev => [...prev, { eventId, type, quantity }]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  const bookTickets = async (eventId: string, type: TicketType, quantity: number): Promise<boolean> => {
    if (!user) return false;
    await new Promise(resolve => setTimeout(resolve, 800));

    const event = events.find(e => e.id === eventId);
    if (!event) return false;
    if (event.availableSeats < quantity) return false;

    const seatsToAssign: string[] = [];
    for (let i = 0; i < quantity; i++) {
        seatsToAssign.push(generateSeat(event.totalSeats, event.availableSeats, i));
    }

    const updatedEvent = { ...event, availableSeats: event.availableSeats - quantity };
    updateEvent(updatedEvent);

    const newTickets: Ticket[] = Array.from({ length: quantity }).map((_, i) => ({
      id: `tkt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      userId: user.id,
      type,
      price: type === TicketType.VIP ? event.priceVip : event.priceRegular,
      status: TicketStatus.VALID,
      purchaseDate: new Date().toISOString(),
      qrCode: `VALID-${eventId}-${user.id}`,
      seat: seatsToAssign[i]
    }));

    setTickets(prev => [...prev, ...newTickets]);
    return true;
  };

  const checkout = async (): Promise<boolean> => {
    if (!user || cart.length === 0) return false;
    await new Promise(resolve => setTimeout(resolve, 1000));

    const needed: Record<string, number> = {};
    for (const item of cart) {
        needed[item.eventId] = (needed[item.eventId] || 0) + item.quantity;
    }

    for (const eventId in needed) {
        const event = events.find(e => e.id === eventId);
        if (!event || event.availableSeats < needed[eventId]) {
            return false; 
        }
    }

    const newEvents = [...events];
    const newTickets: Ticket[] = [];
    const createdTicketIds: string[] = [];
    let totalAmount = 0;

    cart.forEach(item => {
        const eventIndex = newEvents.findIndex(e => e.id === item.eventId);
        if (eventIndex !== -1) {
            const event = newEvents[eventIndex];
            
            const seatsToAssign: string[] = [];
            for (let i = 0; i < item.quantity; i++) {
                seatsToAssign.push(generateSeat(event.totalSeats, event.availableSeats, i));
            }

            newEvents[eventIndex] = {
                ...event,
                availableSeats: event.availableSeats - item.quantity
            };

            const price = item.type === TicketType.VIP ? event.priceVip : event.priceRegular;

            for (let i = 0; i < item.quantity; i++) {
                const ticketId = `tkt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                createdTicketIds.push(ticketId);
                totalAmount += price;

                newTickets.push({
                    id: ticketId,
                    eventId: event.id,
                    userId: user.id,
                    type: item.type,
                    price: price,
                    status: TicketStatus.VALID,
                    purchaseDate: new Date().toISOString(),
                    qrCode: `VALID-${event.id}-${user.id}`,
                    seat: seatsToAssign[i]
                });
            }
        }
    });

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      userId: user.id,
      ticketIds: createdTicketIds,
      totalAmount,
      date: new Date().toISOString()
    };

    setEvents(newEvents);
    setTickets(prev => [...prev, ...newTickets]);
    setBookings(prev => [...prev, newBooking]);
    setCart([]); 
    return true;
  };

  const requestRefund = (ticketId: string, reason: string) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status: TicketStatus.REFUND_REQUESTED, refundReason: reason } : t
    ));
  };

  const processRefund = (ticketId: string, approved: boolean) => {
      setTickets(prev => prev.map(t => {
          if (t.id !== ticketId) return t;
          return {
              ...t,
              status: approved ? TicketStatus.REFUNDED : TicketStatus.VALID
              // If denied, we essentially revert it to VALID so they can use it, 
              // typically you might want a 'REFUND_DENIED' status but VALID works for simplicity.
          };
      }));
  };

  const verifyTicket = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return { valid: false, message: 'Invalid Ticket ID.' };
    if (ticket.status === TicketStatus.USED) return { valid: false, message: 'Ticket already scanned/used.', ticket };
    if (ticket.status === TicketStatus.REFUNDED) return { valid: false, message: 'Ticket was refunded.', ticket };
    if (ticket.status === TicketStatus.REFUND_REQUESTED) return { valid: false, message: 'Refund pending.', ticket };
    if (ticket.status === TicketStatus.EXPIRED) return { valid: false, message: 'Ticket expired.', ticket };
    
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: TicketStatus.USED } : t));
    
    return { valid: true, message: 'Valid Ticket. Access Granted.', ticket };
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <StoreContext.Provider value={{
      user, users, login, logout, updateUser, isAuthenticated: !!user, isAdmin: user?.role === UserRole.ADMIN,
      events, searchEvents, addEvent, deleteEvent, updateEvent,
      tickets, bookings, bookTickets, checkout, requestRefund, processRefund, verifyTicket,
      theme, toggleTheme,
      cart, addToCart, clearCart, removeFromCart,
      language, setLanguage, currency, setCurrency, t, formatPrice, formatDate, formatTime
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};