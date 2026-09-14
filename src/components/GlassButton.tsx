import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';

export type GlassButtonVariant = 
  | 'number' 
  | 'operator' 
  | 'function' 
  | 'action' 
  | 'equals' 
  | 'constant' 
  | 'memory';

interface GlassButtonProps {
  id?: string;
  label: React.ReactNode;
  subLabel?: string;
  variant?: GlassButtonVariant;
  onClick: () => void;
  onHelpClick?: () => void;
  conceptId?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const VARIANT_STYLES: Record<GlassButtonVariant, {
  container: string;
  text: string;
  gloss: string;
  shadow: string;
}> = {
  number: {
    container: 'bg-slate-900/65 hover:bg-slate-800/80 active:bg-slate-700/85 border-white/10 hover:border-cyan-400/30',
    text: 'text-slate-100 font-medium text-lg sm:text-xl',
    gloss: 'from-white/10 to-transparent',
    shadow: 'shadow-sm shadow-black/40'
  },
  operator: {
    container: 'bg-cyan-500/15 hover:bg-cyan-500/25 active:bg-cyan-500/35 border-cyan-400/30 hover:border-cyan-400/55',
    text: 'text-cyan-300 font-bold text-xl sm:text-2xl',
    gloss: 'from-cyan-300/20 to-transparent',
    shadow: 'shadow-sm shadow-cyan-950/30'
  },
  function: {
    container: 'bg-indigo-500/15 hover:bg-indigo-500/25 active:bg-indigo-500/35 border-indigo-400/25 hover:border-indigo-400/50',
    text: 'text-indigo-200 font-semibold text-sm sm:text-base',
    gloss: 'from-indigo-300/15 to-transparent',
    shadow: 'shadow-sm shadow-indigo-950/20'
  },
  constant: {
    container: 'bg-purple-500/15 hover:bg-purple-500/25 active:bg-purple-500/35 border-purple-400/25 hover:border-purple-400/50',
    text: 'text-purple-200 font-semibold text-base sm:text-lg',
    gloss: 'from-purple-300/15 to-transparent',
    shadow: 'shadow-sm shadow-purple-950/20'
  },
  action: {
    container: 'bg-rose-500/15 hover:bg-rose-500/25 active:bg-rose-500/35 border-rose-400/30 hover:border-rose-400/55',
    text: 'text-rose-300 font-bold text-base sm:text-lg',
    gloss: 'from-rose-300/20 to-transparent',
    shadow: 'shadow-sm shadow-rose-950/30'
  },
  equals: {
    container: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-cyan-300/50',
    text: 'text-white font-bold text-2xl sm:text-3xl',
    gloss: 'from-white/35 to-transparent',
    shadow: 'shadow-lg shadow-cyan-500/30'
  },
  memory: {
    container: 'bg-slate-800/60 hover:bg-slate-700/70 active:bg-slate-600/80 border-white/10 hover:border-white/20',
    text: 'text-slate-300 font-medium text-xs sm:text-sm',
    gloss: 'from-white/10 to-transparent',
    shadow: 'shadow-xs shadow-black/30'
  }
};

export const GlassButton: React.FC<GlassButtonProps> = ({
  id,
  label,
  subLabel,
  variant = 'number',
  onClick,
  onHelpClick,
  conceptId,
  className = '',
  ariaLabel,
  disabled = false,
}) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.number;

  return (
    <div className="relative group w-full h-full">
      <motion.button
        id={id}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.94 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
        className={`
          relative w-full h-full min-h-[48px] sm:min-h-[54px] rounded-2xl 
          backdrop-blur-md border 
          flex flex-col items-center justify-center 
          transition-all duration-150 select-none overflow-hidden
          ${styles.container}
          ${styles.text}
          ${styles.shadow}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        {/* Top Gloss Highlight for 3D Glass Look */}
        <div 
          className={`absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b ${styles.gloss} rounded-t-2xl pointer-events-none opacity-80`} 
        />

        {/* Button Content */}
        <span className="relative z-10 flex items-center justify-center gap-1 font-['Fredoka',sans-serif]">
          {label}
        </span>

        {subLabel && (
          <span className="relative z-10 text-[10px] sm:text-xs opacity-75 font-normal tracking-tight">
            {subLabel}
          </span>
        )}
      </motion.button>

      {/* Mini Help / Wonder badge for Kids to learn concepts */}
      {conceptId && onHelpClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onHelpClick();
          }}
          title="Learn what this means!"
          aria-label={`Learn about ${label}`}
          className="absolute -top-1.5 -right-1.5 z-20 w-5 h-5 rounded-full bg-indigo-500/80 hover:bg-indigo-400 text-white border border-white/40 flex items-center justify-center text-[10px] shadow-sm backdrop-blur-sm opacity-60 group-hover:opacity-100 transition-opacity"
        >
          <HelpCircle className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
