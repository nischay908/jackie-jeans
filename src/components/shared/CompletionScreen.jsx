import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';

export default function CompletionScreen({ profileResult }) {
  const [loadingStage, setLoadingStage] = useState(0);

  // Fallback defaults if metrics are missing
  const activeRise = profileResult?.rise || 'Mid rise';
  const activeThigh = profileResult?.thighFit || 'Relaxed';

  useEffect(() => {
    const t1 = setTimeout(() => setLoadingStage(1), 1400);
    const t2 = setTimeout(() => setLoadingStage(2), 2800);
    const t3 = setTimeout(() => {
      // Formulate query payload metrics cleanly to target destination site
      const targetUrl = `https://jackie-jeans.vercel.app/?rise=${encodeURIComponent(activeRise)}&thigh=${encodeURIComponent(activeThigh)}`;
      window.location.href = targetUrl;
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeRise, activeThigh]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b,transparent_60%)] opacity-70" />
      
      <div className="z-10 max-w-sm w-full text-center space-y-8">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
            <Sparkles size={32} className="text-amber-400 animate-spin-slow" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Analyzing Geometry</h2>
          <p className="text-xs text-slate-400">Synthesizing measurements to calibrate premium cuts.</p>
        </div>

        {/* Phase Loading Status Monitor */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left text-xs font-mono text-slate-400 space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${loadingStage >= 0 ? 'bg-purple-400' : 'bg-slate-700'}`} />
            <span>Parsing measurement coordinate vectors...</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${loadingStage >= 1 ? 'bg-purple-400' : 'bg-slate-700'}`} />
            <span className={loadingStage >= 1 ? 'text-white font-bold' : ''}>Isolating blueprint silhouettes for {activeRise}...</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${loadingStage >= 2 ? 'bg-purple-400' : 'bg-slate-700'}`} />
            <span className={loadingStage >= 2 ? 'text-white font-bold' : ''}>Filtering dynamic workspace layouts ({activeThigh})...</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
          <Loader2 size={14} className="animate-spin text-purple-400" />
          <span>Handoff process initiating automatically...</span>
        </div>
      </div>
    </div>
  );
}