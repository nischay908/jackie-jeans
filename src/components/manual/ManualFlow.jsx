import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

const AVAILABLE_BRANDS = [
  "Levi's", "Diesel", "Wrangler", "Lee", "Calvin Klein", "G-Star Raw", "Nudie Jeans", 
  "Zara", "H&M", "AG Jeans", "Frame", "Paige", "7 For All Mankind", "Madewell", "Everlane"
];

const SIZE_OPTIONS = ['24', '26', '28', '30', '32', '34', '36', '38', '40', '42'];

export default function ManualFlow({ onComplete, onBack }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: '', weight: '', waist: '', hip: '', waistFit: '', rise: '', thighFit: '',
    selectedBrands: [], brandSizes: {}, frustration: ''
  });

  const updateField = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

  const toggleBrand = (brand) => {
    setFormData(prev => {
      const current = prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand];
      return { ...prev, selectedBrands: current };
    });
  };

  const updateBrandSize = (brand, size) => {
    setFormData(prev => ({
      ...prev,
      brandSizes: { ...prev.brandSizes, [brand]: size }
    }));
  };

  const handleNextStep = () => {
    // Condition check: Skip step 9 if no brands were selected in step 8
    if (step === 8 && formData.selectedBrands.length === 0) {
      setStep(10);
    } else if (step === 10) {
      onComplete(formData);
    } else {
      setStep(step + 1);
    }
  };

  const handleBackStep = () => {
    if (step === 10 && formData.selectedBrands.length === 0) {
      setStep(8);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  // Input Validation Guard
  const isNextDisabled = () => {
    if (step === 1) return !formData.height;
    if (step === 2) return false; // Optional weight entry
    if (step === 3) return !formData.waist;
    if (step === 4) return !formData.hip;
    if (step === 5) return !formData.waistFit;
    if (step === 6) return !formData.rise;
    if (step === 7) return !formData.thighFit;
    if (step === 8) return false; // Multi-select brands can be empty
    if (step === 9) {
      // Must give a size value for each brand chosen
      return formData.selectedBrands.some(brand => !formData.brandSizes[brand]);
    }
    if (step === 10) return !formData.frustration;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 md:p-6 font-sans">
      {/* Top Header Controls */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between pt-4">
        <button onClick={handleBackStep} className="p-2 hover:bg-white/5 rounded-xl transition-all border border-white/5">
          <ArrowLeft size={18} />
        </button>
        <div className="text-xs font-mono tracking-widest text-slate-500 uppercase">
          Metric Framework <span className="text-purple-400 font-bold">{step}</span> / 10
        </div>
        <div className="w-9" />
      </div>

      {/* Main Structural Quiz Card */}
      <div className="w-full max-w-xl mx-auto my-auto py-6">
        <div className="w-full bg-white/5 h-1.5 rounded-full mb-8 overflow-hidden">
          <motion.div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full" animate={{ width: `${(step / 10) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }} className="space-y-6"
          >
            {/* Step 1: Height Dropdown */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black">1. What is your height?</h3>
                <p className="text-xs text-slate-400">Calibrates precise inseam and structural denim vertical metrics.</p>
                <select 
                  value={formData.height} onChange={(e) => updateField('height', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-base focus:outline-none focus:border-purple-500 transition-all text-white"
                >
                  <option value="" disabled className="bg-slate-900">Select height matrix...</option>
                  {Array.from({ length: 17 }, (_, i) => {
                    const ft = Math.floor((58 + i) / 12);
                    const inch = (58 + i) % 12;
                    return `${ft}'${inch}"`;
                  }).map(h => <option key={h} value={h} className="bg-slate-900">{h}</option>)}
                </select>
              </div>
            )}

            {/* Step 2: Optional Weight Field */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black">2. What is your weight?</h3>
                  <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-md uppercase font-bold tracking-wider">Optional</span>
                </div>
                <p className="text-xs text-slate-400">Calibrates spatial mass ratios to optimize target stretch thresholds.</p>
                <input 
                  type="number" placeholder="Enter weight in lbs..." value={formData.weight}
                  onChange={(e) => updateField('weight', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-base focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            )}

            {/* Step 3: Waist Dropdown */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black">3. Waist measurement in inches</h3>
                <p className="text-xs text-slate-400">Target parameter measured around your narrowest trunk point.</p>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 29 }, (_, i) => `${24 + i}"`).map(w => (
                    <button
                      key={w} onClick={() => updateField('waist', w)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${formData.waist === w ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Hip Dropdown */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black">4. Hip measurement in inches</h3>
                <p className="text-xs text-slate-400">Critical reference alignment taken across the fullest point of seat geometry.</p>
                <select 
                  value={formData.hip} onChange={(e) => updateField('hip', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-base focus:outline-none focus:border-purple-500 text-white"
                >
                  <option value="" disabled className="bg-slate-900">Select hip parameter...</option>
                  {Array.from({ length: 29 }, (_, i) => `${32 + i}"`).map(h => <option key={h} value={h} className="bg-slate-900">{h}</option>)}
                </select>
              </div>
            )}

            {/* Step 5: Waist Feel Choice */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black">5. How do you like jeans to fit at the waist?</h3>
                <p className="text-xs text-slate-400">Determines specific mechanical compression tolerances on waistband bands.</p>
                <div className="space-y-2">
                  {["Snug", "Slightly relaxed", "Relaxed"].map(opt => (
                    <button
                      key={opt} onClick={() => updateField('waistFit', opt)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-bold flex justify-between items-center transition-all ${formData.waistFit === opt ? 'bg-purple-600/30 border-purple-500' : 'bg-white/5 border-white/10'}`}
                    >
                      <span>{opt}</span>
                      {formData.waistFit === opt && <Check size={16} className="text-purple-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Waistband Rise Choice */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black">6. Where should the waistband sit?</h3>
                <p className="text-xs text-slate-400">Alters the vertical rise coordinate configuration profile.</p>
                <div className="grid grid-cols-3 gap-3">
                  {["High rise", "Mid rise", "Low rise"].map(opt => (
                    <button
                      key={opt} onClick={() => updateField('rise', opt)}
                      className={`p-4 rounded-xl border text-xs font-black transition-all text-center ${formData.rise === opt ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Thigh Clearance Choice */}
            {step === 7 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black">7. How should jeans fit through the thighs?</h3>
                <p className="text-xs text-slate-400">Configures baseline horizontal tracking profiles down the upper silhouette legacy.</p>
                <div className="grid grid-cols-3 gap-3">
                  {["Fitted", "Relaxed", "Loose"].map(opt => (
                    <button
                      key={opt} onClick={() => updateField('thighFit', opt)}
                      className={`p-4 rounded-xl border text-xs font-black transition-all text-center ${formData.thighFit === opt ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8: Multi-Select Brands Matrix */}
            {step === 8 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black">8. Which denim brands have you bought before?</h3>
                <p className="text-xs text-slate-400">Cross-analyzes baseline tracking across historic manufacturing lines. Pick any.</p>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 border border-white/5 rounded-xl bg-white/[0.01]">
                  {AVAILABLE_BRANDS.map(brand => {
                    const selected = formData.selectedBrands.includes(brand);
                    return (
                      <button
                        key={brand} onClick={() => toggleBrand(brand)}
                        className={`p-2.5 rounded-lg border text-[11px] font-bold transition-all ${selected ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 9: Conditional Brand Size Allocator */}
            {step === 9 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black">9. What size did you buy in those brands?</h3>
                <p className="text-xs text-slate-400">Maps sizing logic deviations across individual catalog indexes.</p>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                  {formData.selectedBrands.map(brand => (
                    <div key={brand} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs font-black text-indigo-400">{brand}</span>
                      <div className="flex flex-wrap gap-1">
                        {SIZE_OPTIONS.map(sz => (
                          <button
                            key={sz} onClick={() => updateBrandSize(brand, sz)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border transition-all ${formData.brandSizes[brand] === sz ? 'bg-purple-500 border-purple-400' : 'bg-slate-900 border-white/5'}`}
                          >
                            W{sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 10: Structural Frustrations Input */}
            {step === 10 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black">10. Biggest fit frustration when buying jeans?</h3>
                <p className="text-xs text-slate-400">Pinpoints target design corrections to implement on personal profile layout files.</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Waist gap", "Hip tightness", "Wrong length", "Thigh fit", "Rise variance", "Other"].map(frust => (
                    <button
                      key={frust} onClick={() => updateField('frustration', frust)}
                      className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${formData.frustration === frust ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-400' : 'bg-white/5 border-white/10'}`}
                    >
                      {frust}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistent System Action Deck */}
      <div className="w-full max-w-xl mx-auto pb-4 flex justify-end gap-3 items-center">
        {step === 2 && (
          <button onClick={handleNextStep} className="px-4 py-2 text-xs text-slate-400 hover:text-white font-medium transition-all">
            Skip Metric
          </button>
        )}
        <button
          onClick={handleNextStep} disabled={isNextDisabled()}
          className="flex items-center gap-2 bg-white text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs transition-all shadow-xl disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100"
        >
          <span>{step === 10 ? 'Generate Sizing Archetype' : 'Continue'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}