import React, { useState, useEffect } from 'react';
import { useStore } from '../context/Store';
import { User, Mail, Phone, Calendar, Save, Camera, FileText, CheckCircle } from 'lucide-react';

export const Settings = () => {
  const { user, updateUser } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    bio: '',
    avatar: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age ? user.age.toString() : '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : undefined,
      phone: formData.phone,
      bio: formData.bio,
      avatar: formData.avatar
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-200 dark:border-slate-800 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Profile Header & Avatar */}
          <div className="relative h-48 bg-gradient-to-r from-primary-600 to-secondary-500">
            <div className="absolute -bottom-16 left-8 sm:left-12 flex items-end">
              <div className="relative group">
                <img 
                  src={formData.avatar || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 object-cover shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                   <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 sm:px-12 pb-12">
            
            {success && (
              <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400 animate-fade-in">
                <CheckCircle className="w-5 h-5" />
                Profile updated successfully.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" /> Basic Information
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-3 py-3 bg-gray-100 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-400">Email cannot be changed.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avatar URL</label>
                    <input 
                        type="text" 
                        value={formData.avatar}
                        onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                        className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white text-sm"
                        placeholder="https://example.com/image.png"
                    />
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" /> Personal Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="number" 
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white"
                        placeholder="e.g. 25"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white"
                        placeholder="+1 (555)..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white resize-none"
                    placeholder="Tell us a little about yourself..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button 
                type="submit" 
                className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <Save className="w-5 h-5" /> Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};