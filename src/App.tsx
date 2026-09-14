import { useState, useEffect, useCallback } from 'react';
import { AngleMode, GlassTheme, HistoryItem } from './types';
import { GlassBackground } from './components/GlassBackground';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { ScientificKeypad } from './components/ScientificKeypad';
import { ConceptModal } from './components/ConceptModal';
import { VisualizerModal } from './components/VisualizerModal';
import { ChallengeModal } from './components/ChallengeModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ThemeSelector } from './components/ThemeSelector';
import { evaluateExpression } from './utils/mathEngine';
import { soundFx } from './utils/audio';
import { Sparkles, History, Activity, Award, BookOpen, Keyboard } from 'lucide-react';

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [previewResult, setPreviewResult] = useState<string>('');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [glassTheme, setGlassTheme] = useState<GlassTheme>('nebula');
  const [memoryValue, setMemoryValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSciExpanded, setIsSciExpanded] = useState<boolean>(true);

  // History tape
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kids_glass_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('kids_glass_calc_history', JSON.stringify(history.slice(0, 50)));
    } catch {}
  }, [history]);

  // Live preview evaluation as expression changes
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setPreviewResult('');
      setError(null);
      return;
    }
    const evalResult = evaluateExpression(expression, angleMode);
    if (evalResult.success && evalResult.formatted) {
      setPreviewResult(evalResult.formatted);
      setError(null);
    } else {
      setPreviewResult('');
      // don't show error continuously while actively typing unfinished expression
      setError(null);
    }
  }, [expression, angleMode]);

  // Number input
  const handleNumber = useCallback((val: string) => {
    soundFx.playNumber(!soundEnabled);
    setError(null);
    setExpression((prev) => prev + val);
  }, [soundEnabled]);

  // Operator input (+, -, ×, ÷, %, ^)
  const handleOperator = useCallback((op: string) => {
    soundFx.playOperator(!soundEnabled);
    setError(null);
    setExpression((prev) => {
      if (!prev && result && result !== '0' && result !== 'Undefined' && result !== 'Infinity') {
        // Continue from last result
        return result + ' ' + op + ' ';
      }
      return prev + ' ' + op + ' ';
    });
  }, [soundEnabled, result]);

  // Scientific function input (sin(, cos(, √(), etc.)
  const handleFunction = useCallback((fn: string) => {
    soundFx.playFunction(!soundEnabled);
    setError(null);
    setExpression((prev) => prev + fn);
  }, [soundEnabled]);

  // Constant input (π, e)
  const handleConstant = useCallback((c: string) => {
    soundFx.playFunction(!soundEnabled);
    setError(null);
    setExpression((prev) => prev + c);
  }, [soundEnabled]);

  // Clear / Reset
  const handleClear = useCallback(() => {
    soundFx.playClear(!soundEnabled);
    setExpression('');
    setResult('0');
    setPreviewResult('');
    setError(null);
  }, [soundEnabled]);

  // Backspace
  const handleBackspace = useCallback(() => {
    soundFx.playNumber(!soundEnabled);
    setError(null);
    setExpression((prev) => {
      if (prev.length <= 1) return '';
      // Check if trailing is multi-char like "sin(" or "log("
      const funcMatch = prev.match(/(sin\(|cos\(|tan\(|asin\(|acos\(|atan\(|log\(|ln\(|sqrt\(|cbrt\(|abs\(|1\/\()$/);
      if (funcMatch) {
        return prev.slice(0, -funcMatch[0].length);
      }
      // Check trailing spaces around operator
      if (prev.endsWith(' ')) {
        return prev.trimEnd().slice(0, -1).trimEnd();
      }
      return prev.slice(0, -1);
    });
  }, [soundEnabled]);

  // Calculate Equals
  const handleEquals = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    const evalResult = evaluateExpression(expression, angleMode);
    if (evalResult.success && evalResult.formatted) {
      soundFx.playEquals(!soundEnabled);
      setResult(evalResult.formatted);
      setError(null);

      // Add to calculation history tape
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression: expression,
        result: evalResult.formatted,
        timestamp: new Date()
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 49)]);
    } else {
      soundFx.playError(!soundEnabled);
      setError(evalResult.error || "Math Error");
    }
  }, [expression, angleMode, soundEnabled]);

  // Toggle plus/minus sign on current expression or result
  const handleToggleSign = useCallback(() => {
    soundFx.playNumber(!soundEnabled);
    setExpression((prev) => {
      if (!prev) {
        return '-';
      }
      if (prev.startsWith('-')) {
        return prev.slice(1);
      }
      return '-' + prev;
    });
  }, [soundEnabled]);

  // Memory Actions (MC, MR, M+, M-)
  const handleMemoryAction = useCallback((action: 'MC' | 'MR' | 'M+' | 'M-') => {
    soundFx.playFunction(!soundEnabled);
    const currentVal = parseFloat(result) || 0;

    switch (action) {
      case 'MC':
        setMemoryValue(null);
        break;
      case 'MR':
        if (memoryValue !== null) {
          setExpression((prev) => prev + memoryValue.toString());
        }
        break;
      case 'M+':
        setMemoryValue((prev) => (prev ?? 0) + currentVal);
        break;
      case 'M-':
        setMemoryValue((prev) => (prev ?? 0) - currentVal);
        break;
    }
  }, [soundEnabled, result, memoryValue]);

  // Open Concept Explainer
  const handleOpenConcept = (conceptId: string) => {
    setActiveConceptId(conceptId);
    setIsConceptOpen(true);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input inside a modal
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        handleNumber(key);
      } else if (key === '.') {
        handleNumber('.');
      } else if (key === '+') {
        handleOperator('+');
      } else if (key === '-') {
        handleOperator('−');
      } else if (key === '*') {
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === '%') {
        handleOperator('%');
      } else if (key === '(' || key === ')') {
        handleNumber(key);
      } else if (key === '^') {
        handleFunction('^');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleFunction, handleEquals, handleBackspace, handleClear]);

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-between p-3 sm:p-6 text-white selection:bg-cyan-400 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dynamic Glass Morphism Background */}
      <GlassBackground theme={glassTheme} />

      {/* Top App Header & Quick Discovery Bar */}
      <header className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pb-3">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full rounded-2xl bg-[#0a0f1d] backdrop-blur-md flex items-center justify-center text-lg">
              ✨
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-['Fredoka',sans-serif] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200">
              Kids Glass Calculator
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Sleek STEM & Scientific Math in Crystal Glass
            </p>
          </div>
        </div>

        {/* Action Discovery Buttons & Theme Selector */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
          {/* Math Quests / Challenges */}
          <button
            type="button"
            id="header-math-quests-btn"
            onClick={() => setIsChallengeOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-xs font-bold font-['Fredoka',sans-serif] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Kid Math Challenges"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Math Quests</span>
          </button>

          {/* Wave & Shape Visualizer */}
          <button
            type="button"
            id="header-visualizer-btn"
            onClick={() => setIsVisualizerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-bold font-['Fredoka',sans-serif] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Interactive Function Visualizer"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Visualizer</span>
          </button>

          {/* Wonder Explainer Library */}
          <button
            type="button"
            id="header-wonder-library-btn"
            onClick={() => {
              setActiveConceptId('pi');
              setIsConceptOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/30 text-indigo-200 text-xs font-bold font-['Fredoka',sans-serif] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Wonder Explanations"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
            <span>Wonder Library</span>
          </button>

          {/* Calculation History */}
          <button
            type="button"
            id="header-history-btn"
            onClick={() => setIsHistoryOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-white/15 text-slate-200 text-xs font-bold font-['Fredoka',sans-serif] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 relative"
            title="View History Tape"
          >
            <History className="w-3.5 h-3.5 text-slate-300" />
            <span>History</span>
            {history.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow-[0_0_6px_#38bdf8]">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Glass Calculator Card */}
      <main className="w-full max-w-xl mx-auto my-auto py-2">
        <div className="relative rounded-[32px] p-4 sm:p-6 bg-[#0e1322]/75 backdrop-blur-2xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden space-y-4">
          {/* Glass Card Specular Light Top Line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

          {/* Frosted Calculator Display */}
          <CalculatorDisplay
            expression={expression}
            result={result}
            previewResult={previewResult}
            angleMode={angleMode}
            onToggleAngleMode={() => setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'))}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            memoryValue={memoryValue}
            onClearMemory={() => setMemoryValue(null)}
            onBackspace={handleBackspace}
            onOpenExplorer={() => {
              setActiveConceptId('pi');
              setIsConceptOpen(true);
            }}
            error={error}
          />

          {/* Scientific and Standard Keypad */}
          <ScientificKeypad
            onNumber={handleNumber}
            onOperator={handleOperator}
            onFunction={handleFunction}
            onConstant={handleConstant}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onEquals={handleEquals}
            onToggleSign={handleToggleSign}
            onMemoryAction={handleMemoryAction}
            onOpenConcept={handleOpenConcept}
            isSciExpanded={isSciExpanded}
            onToggleSciExpanded={() => setIsSciExpanded((prev) => !prev)}
          />
        </div>
      </main>

      {/* Footer / Theme Selector & Help Hints */}
      <footer className="w-full max-w-4xl mx-auto pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        {/* Glass Theme Selector */}
        <ThemeSelector
          currentTheme={glassTheme}
          onSelectTheme={(th) => setGlassTheme(th)}
        />

        {/* Keyboard Tips indicator */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
          <span>Supports physical keyboard keys (0-9, +, -, *, /, Enter, Backspace)</span>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ConceptModal
        conceptId={activeConceptId}
        isOpen={isConceptOpen}
        onClose={() => setIsConceptOpen(false)}
        onInsertSample={(sample) => {
          setExpression(sample);
          handleEquals();
        }}
      />

      <VisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
      />

      <ChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => setIsChallengeOpen(false)}
        onLoadChallengeToCalc={(keys) => {
          setExpression(keys.filter(k => k !== '=').join(''));
        }}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onSelectHistory={(item) => {
          setExpression(item.expression);
          setResult(item.result);
        }}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
}
