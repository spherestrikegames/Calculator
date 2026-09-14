import React, { useState } from 'react';
import { KidConcept } from '../types';
import { KID_CONCEPTS } from '../utils/kidConcepts';
import { X, Sparkles, Lightbulb, Play, Search, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConceptModalProps {
  conceptId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onInsertSample: (expression: string) => void;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({
  conceptId,
  isOpen,
  onClose,
  onInsertSample
}) => {
  const [selectedId, setSelectedId] = useState<string>(conceptId || 'pi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Keep synced if conceptId prop changes
  React.useEffect(() => {
    if (conceptId) {
      setSelectedId(conceptId);
    }
  }, [conceptId]);

  if (!isOpen) return null;

  const conceptList = Object.values(KID_CONCEPTS);
  const categories = ['All', 'Trigonometry', 'Powers & Roots', 'Constants', 'Functions'];

  const filteredConcepts = conceptList.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeConcept: KidConcept = KID_CONCEPTS[selectedId] || conceptList[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-[#0b101e]/95 border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col text-white font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-['Fredoka',sans-serif] text-white flex items-center gap-2">
                  Math Wonder Library
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-bounce" />
                </h2>
                <p className="text-xs text-slate-400">Tap any scientific concept to see why it matters in real life!</p>
              </div>
            </div>

            <button
              id="close-concept-modal-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all active:scale-95 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Categories Bar */}
          <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3 bg-black/20">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search concepts (e.g. Pi, Sine, Root, Factorial)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 shadow-inner"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-xs'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area: Grid with Sidebar list on large, details on right */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* Concept List Sidebar */}
            <div className="md:col-span-4 p-3 border-r border-white/10 overflow-y-auto max-h-[220px] md:max-h-[500px] space-y-1.5 scrollbar-thin">
              {filteredConcepts.map((concept) => {
                const isSelected = concept.id === activeConcept.id;
                return (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => setSelectedId(concept.id)}
                    className={`w-full p-2.5 rounded-2xl text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/20 border border-purple-400/40 shadow-md'
                        : 'hover:bg-white/5 border border-transparent text-white/80'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${concept.badgeColor} flex items-center justify-center font-bold text-white text-sm shadow-sm`}>
                      {concept.symbol}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white truncate font-['Fredoka',sans-serif]">
                        {concept.title}
                      </div>
                      <div className="text-[11px] text-white/50">{concept.category}</div>
                    </div>
                  </button>
                );
              })}

              {filteredConcepts.length === 0 && (
                <div className="p-4 text-center text-xs text-white/40">
                  No concepts match your search.
                </div>
              )}
            </div>

            {/* Concept Deep-Dive Card */}
            <div className="md:col-span-8 p-4 sm:p-6 overflow-y-auto max-h-[500px] flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Title and Symbol */}
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeConcept.badgeColor} flex items-center justify-center font-bold text-white text-2xl shadow-lg`}>
                    {activeConcept.symbol}
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-cyan-200 border border-white/15">
                      {activeConcept.category}
                    </span>
                    <h3 className="text-2xl font-bold font-['Fredoka',sans-serif] text-white mt-1">
                      {activeConcept.title}
                    </h3>
                  </div>
                </div>

                {/* Kid-Friendly Explanation */}
                <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-md">
                  <h4 className="text-xs uppercase tracking-wider text-cyan-300 font-bold mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    How It Works (In Kid Words)
                  </h4>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    {activeConcept.simpleExplanation}
                  </p>
                </div>

                {/* Real-World Application */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20">
                  <h4 className="text-xs uppercase tracking-wider text-emerald-300 font-bold mb-1.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Where It Appears In Real Life
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    {activeConcept.realWorldExample}
                  </p>
                </div>

                {/* Mind-Blowing Fun Fact */}
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-400/20 text-xs text-purple-200 flex items-start gap-2.5">
                  <span className="text-base">🚀</span>
                  <div>
                    <span className="font-semibold text-purple-100">Fun Fact: </span>
                    {activeConcept.funFact}
                  </div>
                </div>
              </div>

              {/* Sample Calculation Action Box */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                <div>
                  <div className="text-xs text-white/60">Sample Calculation:</div>
                  <div className="text-base font-['JetBrains_Mono',monospace] text-amber-300 font-bold">
                    {activeConcept.sampleExpression} = {activeConcept.sampleAnswer}
                  </div>
                </div>

                <button
                  type="button"
                  id="insert-concept-sample-btn"
                  onClick={() => {
                    onInsertSample(activeConcept.sampleExpression);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Try In Calculator
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
