import React from 'react';
import { GlassTheme } from '../types';
import { Palette } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: GlassTheme;
  onSelectTheme: (theme: GlassTheme) => void;
}

const THEMES: { id: GlassTheme; name: string; dot: string }[] = [
  { id: 'nebula', name: 'Cosmic Nebula', dot: 'from-purple-500 to-indigo-600' },
  { id: 'bubblegum', name: 'Candy Glass', dot: 'from-pink-400 to-rose-500' },
  { id: 'tropical', name: 'Tropical Lagoon', dot: 'from-teal-400 to-emerald-500' },
  { id: 'aurora', name: 'Aurora Borealis', dot: 'from-lime-400 to-teal-500' },
  { id: 'cyber', name: 'Cyber Crystal', dot: 'from-cyan-400 to-blue-600' }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelectTheme }) => {
  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 overflow-x-auto scrollbar-none shadow-sm">
      <div className="flex items-center gap-1 px-2 text-slate-400 text-xs font-semibold">
        <Palette className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Theme:</span>
      </div>
      {THEMES.map((th) => (
        <button
          key={th.id}
          type="button"
          onClick={() => onSelectTheme(th.id)}
          title={th.name}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold font-['Fredoka',sans-serif] flex items-center gap-1.5 transition-all whitespace-nowrap ${
            currentTheme === th.id
              ? 'bg-slate-800 text-white border border-cyan-400/40 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${th.dot} shadow-xs`} />
          <span>{th.name}</span>
        </button>
      ))}
    </div>
  );
};
