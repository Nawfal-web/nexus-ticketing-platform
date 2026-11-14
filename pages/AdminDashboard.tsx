import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/Store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LayoutDashboard, Calendar, QrCode, Plus, Trash2, Edit, Sparkles, X, ChevronRight, Search, Users, Banknote, CheckCircle, XCircle } from 'lucide-react';
import { EventCategory, Event, TicketStatus } from '../types';
import { generateEventDescription } from '../services/geminiService';

const DashboardOverview = () => {
  const { tickets, events, users } = useStore();
  
  const totalRevenue = tickets.reduce((sum, t) => sum + (t.status !== 'REFUNDED' ? t.price : 0), 0);
  const totalTicketsSold = tickets.filter(t => t.status !== 'REFUNDED').length;
  const refundRequests = tickets.filter(t => t.status === TicketStatus.REFUND_REQUESTED).length;

  const data = events.map(e => ({
      name: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
      sold: tickets.filter(t => t.eventId === e.id && t.status !== 'REFUNDED').length,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Revenue</h3>
             <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Tickets Sold</h3>
             <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{totalTicketsSold.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Registered Users</h3>
             <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{users.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Refund Requests</h3>
             <p className={`text-3xl font-bold tracking-tight ${refundRequests > 0 ? 'text-orange-500' : 'text-slate-900 dark:text-white'}`}>{refundRequests}</p>
          </div>
       </div>

       <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm h-96">
          <h3 className="text-lg font-bold mb-8 text-slate-900 dark:text-white">Ticket Sales Performance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12}} 
                dy={10} 
              />
              <YAxis 
                stroke="#9CA3AF" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12}} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              />
              <Bar dataKey="sold" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
};

const ManageEvents = () => {
    const { events, addEvent, deleteEvent, formatDate, formatTime } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<Partial<Event> & { rawDate?: string }>({
        title: '',
        category: EventCategory.CONCERT,
        description: '',
        location: '',
        priceRegular: 0,
        priceVip: 0,
        totalSeats: 100,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        rawDate: ''
    });

    const handleGenerateDescription = async () => {
        if(!formData.title || !formData.category) {
            alert("Please enter a title and category first.");
            return;
        }
        setLoadingAI(true);
        const desc = await generateEventDescription(formData.title!, formData.category!, "exciting, modern");
        setFormData({...formData, description: desc});
        setLoadingAI(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const eventDate = formData.rawDate ? new Date(formData.rawDate).toISOString() : new Date().toISOString();

        const newEvent: Event = {
            id: `e-${Date.now()}`,
            title: formData.title!,
            description: formData.description!,
            date: eventDate,
            location: formData.location!,
            image: formData.image!,
            category: formData.category as EventCategory,
            priceRegular: Number(formData.priceRegular),
            priceVip: Number(formData.priceVip),
            totalSeats: Number(formData.totalSeats),
            availableSeats: Number(formData.totalSeats)
        };
        addEvent(newEvent);
        setIsModalOpen(false);
        setFormData({ title: '', description: '', location: '', priceRegular: 0, priceVip: 0, totalSeats: 100, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', rawDate: '' });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Events</h2>
                    <p className="text-gray-500 text-sm">Manage and organize your listings</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-slate-200/50 dark:shadow-none"
                >
                    <Plus className="w-5 h-5" /> New Event
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30">
                                <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event Name</th>
                                <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                                <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                                <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {events.map(event => (
                                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-5">
                                        <div className="font-semibold text-slate-900 dark:text-white">{event.title}</div>
                                        <div className="text-xs text-gray-500">{event.category}</div>
                                    </td>
                                    <td className="p-5 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="font-medium">{formatDate(event.date)}</div>
                                        <div className="text-xs text-gray-500">{formatTime(event.date)}</div>
                                    </td>
                                    <td className="p-5 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full max-w-[80px] h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-500 rounded-full" style={{width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%`}}></div>
                                            </div>
                                            <span className="text-xs text-gray-500">{event.totalSeats - event.availableSeats}/{event.totalSeats}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button onClick={() => deleteEvent(event.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-slate-800 animate-slide-up">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Event</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Title</label>
                                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white" placeholder="Event Name" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Date & Time</label>
                                    <input 
                                        type="datetime-local" 
                                        required 
                                        value={formData.rawDate} 
                                        onChange={e => setFormData({...formData, rawDate: e.target.value})} 
                                        className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Location</label>
                                    <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white" placeholder="Venue City" />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Category</label>
                                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as EventCategory})} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white">
                                    {Object.values(EventCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex justify-between">
                                    Description 
                                    <button type="button" onClick={handleGenerateDescription} disabled={loadingAI} className="text-primary-600 hover:text-primary-700 text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                                        <Sparkles className="w-3 h-3" /> {loadingAI ? 'Thinking...' : 'AI Generate'}
                                    </button>
                                </label>
                                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white" placeholder="Event details..."></textarea>
                            </div>

                            <div className="grid grid-cols-3 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Reg Price</label>
                                    <input type="number" required value={formData.priceRegular} onChange={e => setFormData({...formData, priceRegular: Number(e.target.value)})} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">VIP Price</label>
                                    <input type="number" required value={formData.priceVip} onChange={e => setFormData({...formData, priceVip: Number(e.target.value)})} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Capacity</label>
                                    <input type="number" required value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: Number(e.target.value)})} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-xl font-bold hover:shadow-lg transition-all">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ManageUsers = () => {
    const { users, tickets, formatDate } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
                    <p className="text-gray-500 text-sm">View and manage registered users</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary-500 text-sm dark:text-white"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30">
                                <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tickets Purchased</th>
                                <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Join Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredUsers.map(user => {
                                const userTicketCount = tickets.filter(t => t.userId === user.id).length;
                                return (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-100" />
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-gray-600 dark:text-gray-400 font-mono">
                                            {userTicketCount}
                                        </td>
                                        <td className="p-5 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(new Date())} {/* Mock Join Date */}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ManageRefunds = () => {
    const { tickets, events, users, processRefund } = useStore();
    const pendingRefunds = tickets.filter(t => t.status === TicketStatus.REFUND_REQUESTED);

    return (
        <div className="animate-fade-in">
             <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Refund Requests</h2>
                <p className="text-gray-500 text-sm">Review and approve ticket cancellations</p>
            </div>

            {pendingRefunds.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                         <Banknote className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No pending requests</h3>
                    <p className="text-gray-500 mt-1">There are currently no tickets waiting for refund approval.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30">
                                    <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ticket Info</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                                    <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Decision</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {pendingRefunds.map(ticket => {
                                    const event = events.find(e => e.id === ticket.eventId);
                                    const user = users.find(u => u.id === ticket.userId);
                                    
                                    return (
                                        <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-5">
                                                <div className="font-semibold text-slate-900 dark:text-white">{event?.title || 'Unknown Event'}</div>
                                                <div className="text-xs text-gray-500 mb-1">{ticket.id}</div>
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 uppercase">
                                                    ${ticket.price}
                                                </span>
                                            </td>
                                            <td className="p-5 text-sm text-gray-600 dark:text-gray-400">
                                                {user?.name || 'Unknown User'}
                                                <div className="text-xs text-gray-500">{user?.email}</div>
                                            </td>
                                            <td className="p-5 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                                                <p className="line-clamp-2 italic">"{ticket.refundReason}"</p>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => processRefund(ticket.id, true)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                                    >
                                                        <CheckCircle className="w-3 h-3" /> Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => processRefund(ticket.id, false)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                    >
                                                        <XCircle className="w-3 h-3" /> Deny
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminDashboard = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 md:h-screen md:sticky md:top-16 pt-8 pb-6 px-4">
                <div className="space-y-1">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Dashboard</p>
                    <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${location.pathname === '/admin' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                        <LayoutDashboard className="w-5 h-5" /> Overview
                    </Link>
                    <Link to="/admin/events" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${location.pathname === '/admin/events' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                        <Calendar className="w-5 h-5" /> Events
                    </Link>
                    <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${location.pathname === '/admin/users' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                        <Users className="w-5 h-5" /> Users
                    </Link>
                    <Link to="/admin/refunds" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${location.pathname === '/admin/refunds' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                        <Banknote className="w-5 h-5" /> Refunds
                    </Link>
                     <Link to="/scanner" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${location.pathname === '/scanner' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                        <QrCode className="w-5 h-5" /> QR Scanner
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
                <Routes>
                    <Route path="/" element={<DashboardOverview />} />
                    <Route path="/events" element={<ManageEvents />} />
                    <Route path="/users" element={<ManageUsers />} />
                    <Route path="/refunds" element={<ManageRefunds />} />
                </Routes>
            </main>
        </div>
    );
};