import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, MessageSquare, User, Sparkles, Sliders, Shirt } from 'lucide-react';

const INTRO_PHASES = [
  { 
    prefix: "Finding the perfect denim shouldn't be a ", 
    highlight: "guessing game.", 
    suffix: "" 
  },
  { 
    prefix: "No more returning wrong sizes. No more ", 
    highlight: "waist gaps.", 
    suffix: "" 
  },
  { 
    prefix: "Just premium fits engineered ", 
    highlight: "uniquely for your shape.", 
    suffix: "" 
  },
  { 
    prefix: "Welcome to Jackie Jeans ", 
    highlight: "Smart Fit Onboarding.", 
    suffix: "" 
  }
];

export default function Landing({ onStartManual, onStartVoice, onOpenLogin, userProfile }) {
  const [phase, setPhase] = useState(0);
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    if (phase < INTRO_PHASES.length) {
      const timer = setTimeout(() => setPhase((prev) => prev + 1), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowMainContent(true);
    }
  }, [phase]);

  return (
    <div className="relative min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center text-white overflow-hidden p-4 md:p-6">
      
      {/* Premium Denim Texture & Fashion Glow Background */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-black" />
      <div className="absolute top-[-10%] left-[-20%] w-[60rem] h-[60rem] bg-gradient-to-br from-blue-600/20 to-purple-600/0 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50rem] h-[50rem] bg-gradient-to-tr from-indigo-500/15 to-amber-500/5 rounded-full blur-[120px]" />

      <AnimatePresence mode="wait">
        {!showMainContent ? (
          <motion.div 
            key="intro" 
            className="z-10 text-center max-w-3xl px-6 flex flex-col items-center"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            {INTRO_PHASES[phase] && (
              <motion.h1
                key={phase}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-3xl md:text-5xl font-black tracking-tight leading-tight select-none font-sans"
              >
                <span>{INTRO_PHASES[phase].prefix}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-400 to-indigo-400 drop-shadow-[0_2px_10px_rgba(168,85,247,0.2)]">
                  {INTRO_PHASES[phase].highlight}
                </span>
                <span>{INTRO_PHASES[phase].suffix}</span>
              </motion.h1>
            )}
            
            <motion.button 
              onClick={() => setShowMainContent(true)} 
              className="mt-16 text-[11px] font-mono text-slate-500 hover:text-amber-300 tracking-[0.2em] uppercase border-b border-white/5 pb-1 hover:border-amber-300/40 transition-all duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Skip Introduction
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="main" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4"
          >
            {/* Left Column: Premium Fashion Pitch */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-[11px] text-indigo-300 font-bold uppercase tracking-widest backdrop-blur-sm">
                <Sparkles size={12} className="text-amber-400" /> Tailored Fit AI Modeling Engine
              </div>
              
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                JACKIE JEANS
              </h2>
              
              <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-md font-light">
                Engineering premium denim configurations designed around your unique anatomy. No guess work. No compromises.
              </p>

              {/* Grid Feature Matrix Cards */}
              <div className="space-y-3 pt-4">
                <div className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md hover:border-white/10 transition-colors">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl h-fit border border-indigo-500/20">
                    <Sliders size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Anatomical Contour Tracking</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Maps waist-to-hip volumetric ratios to completely eliminate waistband gaps.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md hover:border-white/10 transition-colors">
                  <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl h-fit border border-purple-500/20">
                    <Shirt size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Premium Textile Calibration</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Matches personal density and height metrics with correct denim stretch indexes.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Portal Selection Panel */}
            <div className="bg-gradient-to-b from-slate-900/60 to-black/80 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              
              <div className="flex justify-between items-center">
                <div className="space-y-1 text-left">
                  <h3 className="text-xl font-bold tracking-tight">Begin Sizing Assessment</h3>
                  <p className="text-xs text-slate-400">Select an input framework below to start.</p>
                </div>
                <button 
                  onClick={onOpenLogin} 
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all shadow-md"
                >
                  <User size={13} className="text-purple-400" />
                  <span>{userProfile ? `Hi, ${userProfile.name}` : 'Sign In'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={onStartManual} 
                  className="group flex items-center justify-between w-full bg-white text-slate-950 font-bold p-5 rounded-2xl shadow-xl transition-all hover:bg-slate-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-slate-900 text-white rounded-xl group-hover:bg-purple-950 group-hover:text-purple-300 transition-colors">
                      <Play size={16} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-sm font-black tracking-tight">Manual Diagnostic Form</div>
                      <div className="text-xs text-slate-500 font-normal mt-0.5">Input step-by-step custom configurations</div>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={onStartVoice} 
                  className="group flex items-center justify-between w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 text-white font-bold p-5 rounded-2xl shadow-xl transition-all hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] border border-white/10"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-white/10 text-amber-300 rounded-xl group-hover:bg-white/20 transition-colors">
                      <MessageSquare size={16} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-sm font-black tracking-tight">AI Conversational Stylist</div>
                      <div className="text-xs text-purple-200 font-normal mt-0.5">Analyze parameters naturally using voice tracking</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}