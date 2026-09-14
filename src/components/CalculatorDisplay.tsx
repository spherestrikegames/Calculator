import React, { useState } from 'react';
import { AngleMode } from '../types';
import { Copy, Check, Delete, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  previewResult: string;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  memoryValue: number | null;
  onClearMemory: () => void;
  onBackspace: () => void;
  onOpenExplorer: () => void;
  error?: string | null;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  previewResult,
  angleMode,
  onToggleAngleMode,
  soundEnabled,
  onToggleSound,
  memoryValue,
  onBackspace,
  onOpenExplorer,
  error
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = result || expression || '0';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Bracket counting for visual feedback
  const openCount = (expression.match(/\(/g) || []).length;
  const closeCount = (expression.match(/\)/g) || []).length;
  const isBracketUnbalanced = openCount !== closeCount;

  return (
    <div className="relative w-full rounded-3xl p-4 sm:p-6 bg-[#0a0f1e]/80 backdrop-blur-2xl border border-white/15 shadow-[inset_0_2px_16px_rgba(0,0,0,0.6),0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between min-h-[160px] sm:min-h-[185px]">
      {/* Top Glass Specular Refraction */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/[0.06] to-transparent rounded-t-3xl pointer-events-none" />

      {/* Top Status Bar: Mode, Memory, Sound, Actions */}
      <div className="relative z-10 flex items-center justify-between gap-2 text-xs font-['Fredoka',sans-serif]">
        {/* Left Side: Angle Mode & Memory Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Angle Mode Toggle */}
          <button
            type="button"
            id="toggle-angle-mode-btn"
            onClick={onToggleAngleMode}
            className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 text-cyan-300 font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs"
            title={`Current: ${angleMode} (Degrees / Radians)`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span>{angleMode}</span>
          </button>

          {/* Memory Tag */}
          {memoryValue !== null && (
            <span className="px-2.5 py-0.5 rounded-xl bg-indigo-950/70 border border-indigo-400/30 text-indigo-300 font-medium text-[11px] flex items-center gap-1 shadow-xs">
              <span className="text-indigo-400/80">M:</span>
              <span className="font-mono font-bold">{memoryValue}</span>
            </span>
          )}

          {/* Unclosed Bracket Helper for Kids */}
          {isBracketUnbalanced && (
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px]">
              {openCount > closeCount ? `Need ${openCount - closeCount} ')'` : `Extra ')'`}
            </span>
          )}
        </div>

        {/* Right Side: Sound, Math Explorer, Copy, Backspace */}
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            type="button"
            id="toggle-sound-btn"
            onClick={onToggleSound}
            className="p-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            title={soundEnabled ? 'Sound FX On (Click to Mute)' : 'Sound FX Muted'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400 opacity-60" />}
          </button>

          {/* Math Wonder / Concept Explorer */}
          <button
            type="button"
            id="open-concept-explorer-btn"
            onClick={onOpenExplorer}
            className="px-2.5 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 shadow-xs"
            title="Open Math Wonder Library"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden xs:inline">Learn</span>
          </button>

          {/* Copy Result Button */}
          <button
            type="button"
            id="copy-result-btn"
            onClick={handleCopy}
            className="p-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95 relative"
            title="Copy current value"
            aria-label="Copy value"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            id="backspace-display-btn"
            onClick={onBackspace}
            className="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-rose-300 transition-all active:scale-95"
            title="Delete last character"
            aria-label="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle: Math Expression Line */}
      <div className="relative z-10 my-2 text-right overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="text-slate-300/80 font-['JetBrains_Mono',monospace] text-base sm:text-lg tracking-wide min-h-[28px] flex items-center justify-end gap-1">
          {expression ? (
            <span>{expression}</span>
          ) : (
            <span className="text-slate-500 text-sm font-sans flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400/60" />
              Tap keys to start calculating...
            </span>
          )}
          {/* Subtle cursor pulse */}
          <span className="w-0.5 h-5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_6px_#38bdf8]" />
        </div>
      </div>

      {/* Bottom: Main Output Result & Live Preview */}
      <div className="relative z-10 flex flex-col items-end justify-end">
        {/* Live Preview / Error Alert */}
        <div className="min-h-[20px] text-right font-['Fredoka',sans-serif]">
          {error ? (
            <span className="text-rose-300 text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-400/30">
              {error}
            </span>
          ) : previewResult && previewResult !== result ? (
            <span className="text-cyan-400/75 text-sm font-['JetBrains_Mono',monospace]">
              ≈ {previewResult}
            </span>
          ) : null}
        </div>

        {/* Large Result Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={result || '0'}
            initial={{ opacity: 0.7, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Fredoka',sans-serif] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200 tracking-tight select-all drop-shadow-[0_0_15px_rgba(56,189,248,0.15)] max-w-full overflow-x-auto overflow-y-hidden scrollbar-none py-0.5"
          >
            {result || '0'}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
