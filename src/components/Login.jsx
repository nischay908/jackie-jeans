import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function Login({ onClose, onLoginSuccess, currentProfile }) {
  const [name, setName] = useState(currentProfile?.name || '');
  const [email, setEmail] = useState(currentProfile?.email || '');
  const [isSaved, setIsSaved] = useState(false);

  const processForm = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const mockSchema = {
      name,
      email,
      preferences: currentProfile?.preferences || {
        waist: '32"',
        rise: 'Mid rise',
        thighFit: 'Relaxed'
      }
    };

    onLoginSuccess(mockSchema);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 15 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-6 shadow-2xl relative text-white"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors">
          <X size={18} />
        </button>

        <div className="mb-6 space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 uppercase tracking-widest font-black mb-1">
            <ShieldCheck size={12} /> Secure Sync Portal
          </div>
          <h3 className="text-2xl font-black tracking-tight">Access Sizing Vault</h3>
          <p className="text-xs text-slate-400">Link your authentication matrix to lock parameter structures across endpoints.</p>
        </div>

        {isSaved ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-black text-sm text-white">Sizing Profiles Synchronized</p>
              <p className="text-[11px] text-slate-400">Updating active session cache...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={processForm} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">First Name</label>
              <div className="relative">
                <User size={14} className="absolute left-4 top-3.5 text-slate-500" />
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="Enter name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-3.5 text-slate-500" />
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="name@domain.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-white text-slate-950 font-black py-3.5 rounded-xl text-xs hover:bg-slate-100 transition-all active:scale-[0.99] mt-2">
              Synchronize Fit Session
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}