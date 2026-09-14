import React from 'react';
import { GlassTheme } from '../types';

interface GlassBackgroundProps {
  theme: GlassTheme;
}

const THEME_STYLES: Record<GlassTheme, {
  bg: string;
  orb1: string;
  orb2: string;
  orb3: string;
  orb4: string;
  glow: string;
}> = {
  nebula: {
    bg: 'bg-[#0a0c14]',
    orb1: 'bg-indigo-600/25',
    orb2: 'bg-cyan-500/20',
    orb3: 'bg-purple-600/20',
    orb4: 'bg-blue-500/15',
    glow: 'rgba(99, 102, 241, 0.15)',
  },
  bubblegum: {
    bg: 'bg-[#0c0814]',
    orb1: 'bg-pink-500/25',
    orb2: 'bg-purple-600/20',
    orb3: 'bg-rose-500/20',
    orb4: 'bg-amber-400/15',
    glow: 'rgba(236, 72, 153, 0.15)',
  },
  tropical: {
    bg: 'bg-[#060e12]',
    orb1: 'bg-teal-500/25',
    orb2: 'bg-emerald-500/20',
    orb3: 'bg-cyan-400/20',
    orb4: 'bg-sky-500/15',
    glow: 'rgba(20, 184, 166, 0.15)',
  },
  aurora: {
    bg: 'bg-[#080d14]',
    orb1: 'bg-emerald-500/25',
    orb2: 'bg-lime-400/15',
    orb3: 'bg-teal-600/20',
    orb4: 'bg-cyan-500/20',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  cyber: {
    bg: 'bg-[#070b14]',
    orb1: 'bg-cyan-500/25',
    orb2: 'bg-blue-600/20',
    orb3: 'bg-violet-600/20',
    orb4: 'bg-sky-400/15',
    glow: 'rgba(6, 182, 212, 0.15)',
  }
};

export const GlassBackground: React.FC<GlassBackgroundProps> = ({ theme }) => {
  const current = THEME_STYLES[theme] || THEME_STYLES.nebula;

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-colors duration-700 ${current.bg} -z-10`}>
      {/* Sleek subtle radial spotlight */}
      <div 
        className="absolute inset-0 opacity-70 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${current.glow} 0%, transparent 65%)`
        }}
      />

      {/* Sleek subtle dot matrix background */}
      <div 
        className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]"
      />

      {/* Ambient floating glowing glass orbs with sleek diffusion */}
      <div 
        className={`absolute -top-32 -left-20 w-[450px] h-[450px] rounded-full blur-[110px] animate-pulse transition-all duration-1000 ${current.orb1}`}
        style={{ animationDuration: '9s' }}
      />
      <div 
        className={`absolute top-1/4 -right-28 w-[400px] h-[400px] rounded-full blur-[120px] animate-pulse transition-all duration-1000 ${current.orb2}`}
        style={{ animationDuration: '11s' }}
      />
      <div 
        className={`absolute -bottom-28 left-1/4 w-[450px] h-[450px] rounded-full blur-[130px] animate-pulse transition-all duration-1000 ${current.orb3}`}
        style={{ animationDuration: '10s' }}
      />
      <div 
        className={`absolute top-2/3 right-1/4 w-[350px] h-[350px] rounded-full blur-[100px] animate-pulse transition-all duration-1000 ${current.orb4}`}
        style={{ animationDuration: '12s' }}
      />

      {/* Top subtle rim highlight & dark bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};

