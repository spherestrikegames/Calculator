import React, { useState } from 'react';
import { KID_CHALLENGES } from '../utils/kidConcepts';
import { MathChallenge } from '../types';
import { X, Award, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Lightbulb, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadChallengeToCalc: (suggestedKeys: string[]) => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  onLoadChallengeToCalc
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong' | null; message: string }>({
    status: null,
    message: ''
  });
  const [completedList, setCompletedList] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const currentChallenge: MathChallenge = KID_CHALLENGES[currentIndex];

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const parsed = parseFloat(userAnswer);
    if (Number.isNaN(parsed)) {
      setFeedback({ status: 'wrong', message: 'Please type a valid number!' });
      return;
    }

    const tolerance = currentChallenge.tolerance || 0.05;
    const isCorrect = Math.abs(parsed - currentChallenge.targetAnswer) <= tolerance;

    if (isCorrect) {
      setFeedback({
        status: 'correct',
        message: currentChallenge.explanation
      });
      if (!completedList.includes(currentChallenge.id)) {
        setCompletedList(prev => [...prev, currentChallenge.id]);
      }

      // Celebratory Confetti blast!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#f472b6', '#facc15', '#34d399', '#a855f7']
        });
      } catch {}
    } else {
      setFeedback({
        status: 'wrong',
        message: `Not quite! Check the hint or try solving it on the scientific keys.`
      });
    }
  };

  const handleNext = () => {
    setUserAnswer('');
    setFeedback({ status: null, message: '' });
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % KID_CHALLENGES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 10 }}
        className="relative w-full max-w-2xl rounded-3xl bg-[#0b101e]/95 border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col text-white font-['Plus_Jakarta_Sans',sans-serif]"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Award className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Fredoka',sans-serif] text-white flex items-center gap-2">
                Kid Scientific Math Quests
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-xs text-slate-400">
                Solved: {completedList.length} / {KID_CHALLENGES.length} Quests
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all active:scale-95 border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quest Navigation Dots */}
        <div className="px-6 py-3 bg-black/20 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {KID_CHALLENGES.map((ch, idx) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setUserAnswer('');
                  setFeedback({ status: null, message: '' });
                  setShowHint(false);
                }}
                className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                  currentIndex === idx
                    ? 'bg-amber-400 text-slate-950 scale-110 shadow-md shadow-amber-400/30'
                    : completedList.includes(ch.id)
                    ? 'bg-emerald-500/40 text-emerald-200 border border-emerald-400/40'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800/80 border border-white/10'
                }`}
              >
                {completedList.includes(ch.id) ? '✓' : idx + 1}
              </button>
            ))}
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 font-semibold border border-white/10">
            {currentChallenge.level}
          </span>
        </div>

        {/* Question Body */}
        <div className="p-6 space-y-5">
          <div className="p-5 rounded-2xl bg-[#0e1424]/80 border border-white/10 backdrop-blur-md">
            <h3 className="text-base sm:text-lg font-bold font-['Fredoka',sans-serif] text-white leading-relaxed">
              {currentChallenge.question}
            </h3>
          </div>

          {/* Hint Toggle */}
          <div>
            {showHint ? (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span><span className="font-bold">Hint:</span> {currentChallenge.hint}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs text-amber-300 hover:text-amber-200 underline underline-offset-4 flex items-center gap-1"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Need a hint?
              </button>
            )}
          </div>

          {/* Answer Form */}
          <form onSubmit={handleCheckAnswer} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                step="any"
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/15 text-lg font-['JetBrains_Mono',monospace] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-inner"
              />

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-400/25 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Check Answer
              </button>
            </div>
          </form>

          {/* Feedback Display */}
          <AnimatePresence>
            {feedback.status && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl flex items-start gap-3 border ${
                  feedback.status === 'correct'
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100'
                    : 'bg-rose-500/20 border-rose-400/40 text-rose-100'
                }`}
              >
                {feedback.status === 'correct' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-sm">
                  {feedback.message}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Actions: Next Quest & Use In Calculator */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onLoadChallengeToCalc(currentChallenge.suggestedKeys);
                onClose();
              }}
              className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/25 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-cyan-300" />
              Build On Calculator
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Next Quest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
