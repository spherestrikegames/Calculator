import React from 'react';
import { HistoryItem } from '../types';
import { X, Trash2, Clock, RotateCcw, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryDrawerProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  history,
  onClose,
  onSelectHistory,
  onClearHistory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-md h-full bg-[#0a0e1c]/95 border-l border-white/15 shadow-2xl backdrop-blur-2xl flex flex-col text-white font-['Plus_Jakarta_Sans',sans-serif]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h3 className="font-bold font-['Fredoka',sans-serif] text-base text-white">Calculation Tape</h3>
              <p className="text-xs text-slate-400">{history.length} saved equations</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {history.length > 0 && (
              <button
                type="button"
                id="clear-all-history-btn"
                onClick={onClearHistory}
                className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/20 text-rose-300 text-xs flex items-center gap-1 transition-all"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              id="close-history-drawer-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of History items */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <Clock className="w-10 h-10 stroke-[1.5] text-slate-600" />
              <p className="text-sm font-['Fredoka',sans-serif]">No past calculations yet!</p>
              <p className="text-xs max-w-xs text-slate-500">
                Calculations will appear here whenever you press the = button.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  onSelectHistory(item);
                  onClose();
                }}
                className="group p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer shadow-xs relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-cyan-300 transition-opacity flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Recall
                  </span>
                </div>

                <div className="text-sm font-['JetBrains_Mono',monospace] text-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
                  {item.expression}
                </div>

                <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/5">
                  <span className="text-xs text-slate-400">=</span>
                  <span className="text-lg font-bold font-['Fredoka',sans-serif] text-cyan-200">
                    {item.result}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
