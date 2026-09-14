import React from 'react';
import { GlassButton } from './GlassButton';

interface ScientificKeypadProps {
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onFunction: (fn: string) => void;
  onConstant: (c: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onToggleSign: () => void;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-') => void;
  onOpenConcept: (conceptId: string) => void;
  isSciExpanded: boolean;
  onToggleSciExpanded: () => void;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onNumber,
  onOperator,
  onFunction,
  onConstant,
  onClear,
  onBackspace,
  onEquals,
  onToggleSign,
  onMemoryAction,
  onOpenConcept,
  isSciExpanded,
  onToggleSciExpanded
}) => {
  return (
    <div className="w-full space-y-2.5">
      {/* Top Scientific Toolbar / Toggle */}
      <div className="flex items-center justify-between gap-2 px-1">
        {/* Memory Keys Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <GlassButton
            label="MC"
            variant="memory"
            onClick={() => onMemoryAction('MC')}
            className="!min-h-[34px] px-2.5"
            ariaLabel="Memory Clear"
          />
          <GlassButton
            label="MR"
            variant="memory"
            onClick={() => onMemoryAction('MR')}
            className="!min-h-[34px] px-2.5"
            ariaLabel="Memory Recall"
          />
          <GlassButton
            label="M+"
            variant="memory"
            onClick={() => onMemoryAction('M+')}
            className="!min-h-[34px] px-2.5"
            ariaLabel="Memory Add"
          />
          <GlassButton
            label="M-"
            variant="memory"
            onClick={() => onMemoryAction('M-')}
            className="!min-h-[34px] px-2.5"
            ariaLabel="Memory Subtract"
          />
        </div>

        {/* Mobile / Tablet Scientific Toggle button */}
        <button
          type="button"
          onClick={onToggleSciExpanded}
          className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-bold font-['Fredoka',sans-serif] transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap shadow-xs"
        >
          <span>{isSciExpanded ? 'Hide Sci Keys' : '🔬 Sci Keys'}</span>
        </button>
      </div>

      {/* Scientific Function Deck (Expanded on Desktop or when toggled) */}
      <div className={`${isSciExpanded ? 'grid' : 'hidden lg:grid'} grid-cols-4 sm:grid-cols-6 gap-2 p-2.5 rounded-2xl bg-[#080d19]/80 border border-white/10 backdrop-blur-xl shadow-inner`}>
        {/* Row 1: Trig & Powers */}
        <GlassButton
          label="sin"
          subLabel="wave"
          variant="function"
          conceptId="sin"
          onClick={() => onFunction('sin(')}
          onHelpClick={() => onOpenConcept('sin')}
        />
        <GlassButton
          label="cos"
          subLabel="angle"
          variant="function"
          conceptId="cos"
          onClick={() => onFunction('cos(')}
          onHelpClick={() => onOpenConcept('cos')}
        />
        <GlassButton
          label="tan"
          subLabel="slope"
          variant="function"
          conceptId="tan"
          onClick={() => onFunction('tan(')}
          onHelpClick={() => onOpenConcept('tan')}
        />
        <GlassButton
          label="√"
          subLabel="sqrt"
          variant="function"
          conceptId="sqrt"
          onClick={() => onFunction('√(')}
          onHelpClick={() => onOpenConcept('sqrt')}
        />
        <GlassButton
          label="∛"
          subLabel="cbrt"
          variant="function"
          conceptId="cbrt"
          onClick={() => onFunction('∛(')}
          onHelpClick={() => onOpenConcept('cbrt')}
        />
        <GlassButton
          label="x²"
          subLabel="square"
          variant="function"
          conceptId="pow2"
          onClick={() => onFunction('^2')}
          onHelpClick={() => onOpenConcept('pow2')}
        />

        {/* Row 2: Powers, Roots, Logs, Factorial */}
        <GlassButton
          label="x³"
          subLabel="cube"
          variant="function"
          conceptId="pow3"
          onClick={() => onFunction('^3')}
          onHelpClick={() => onOpenConcept('pow3')}
        />
        <GlassButton
          label="xʸ"
          subLabel="power"
          variant="function"
          conceptId="powY"
          onClick={() => onFunction('^')}
          onHelpClick={() => onOpenConcept('powY')}
        />
        <GlassButton
          label="log"
          subLabel="base10"
          variant="function"
          conceptId="log"
          onClick={() => onFunction('log(')}
          onHelpClick={() => onOpenConcept('log')}
        />
        <GlassButton
          label="ln"
          subLabel="nature"
          variant="function"
          conceptId="ln"
          onClick={() => onFunction('ln(')}
          onHelpClick={() => onOpenConcept('ln')}
        />
        <GlassButton
          label="n!"
          subLabel="order"
          variant="function"
          conceptId="factorial"
          onClick={() => onFunction('!')}
          onHelpClick={() => onOpenConcept('factorial')}
        />
        <GlassButton
          label="1/x"
          subLabel="fraction"
          variant="function"
          conceptId="reciprocal"
          onClick={() => onFunction('1/(')}
          onHelpClick={() => onOpenConcept('reciprocal')}
        />

        {/* Row 3: Constants & Brackets */}
        <GlassButton
          label="π"
          subLabel="3.1415"
          variant="constant"
          conceptId="pi"
          onClick={() => onConstant('π')}
          onHelpClick={() => onOpenConcept('pi')}
        />
        <GlassButton
          label="e"
          subLabel="2.7182"
          variant="constant"
          conceptId="e"
          onClick={() => onConstant('e')}
          onHelpClick={() => onOpenConcept('e')}
        />
        <GlassButton
          label="|x|"
          subLabel="abs"
          variant="function"
          conceptId="abs"
          onClick={() => onFunction('abs(')}
          onHelpClick={() => onOpenConcept('abs')}
        />
        <GlassButton
          label="("
          variant="function"
          onClick={() => onNumber('(')}
        />
        <GlassButton
          label=")"
          variant="function"
          onClick={() => onNumber(')')}
        />
        <GlassButton
          label="%"
          subLabel="pct"
          variant="function"
          onClick={() => onOperator('%')}
        />
      </div>

      {/* Main Standard Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1 */}
        <GlassButton
          id="btn-all-clear"
          label="AC"
          variant="action"
          onClick={onClear}
          ariaLabel="All Clear"
        />
        <GlassButton
          id="btn-parentheses"
          label="( )"
          variant="function"
          onClick={() => onNumber('(')}
          ariaLabel="Parentheses"
        />
        <GlassButton
          id="btn-percent"
          label="%"
          variant="function"
          onClick={() => onOperator('%')}
          ariaLabel="Percent"
        />
        <GlassButton
          id="btn-divide"
          label="÷"
          variant="operator"
          onClick={() => onOperator('÷')}
          ariaLabel="Divide"
        />

        {/* Row 2 */}
        <GlassButton
          id="btn-7"
          label="7"
          variant="number"
          onClick={() => onNumber('7')}
        />
        <GlassButton
          id="btn-8"
          label="8"
          variant="number"
          onClick={() => onNumber('8')}
        />
        <GlassButton
          id="btn-9"
          label="9"
          variant="number"
          onClick={() => onNumber('9')}
        />
        <GlassButton
          id="btn-multiply"
          label="×"
          variant="operator"
          onClick={() => onOperator('×')}
          ariaLabel="Multiply"
        />

        {/* Row 3 */}
        <GlassButton
          id="btn-4"
          label="4"
          variant="number"
          onClick={() => onNumber('4')}
        />
        <GlassButton
          id="btn-5"
          label="5"
          variant="number"
          onClick={() => onNumber('5')}
        />
        <GlassButton
          id="btn-6"
          label="6"
          variant="number"
          onClick={() => onNumber('6')}
        />
        <GlassButton
          id="btn-subtract"
          label="−"
          variant="operator"
          onClick={() => onOperator('−')}
          ariaLabel="Subtract"
        />

        {/* Row 4 */}
        <GlassButton
          id="btn-1"
          label="1"
          variant="number"
          onClick={() => onNumber('1')}
        />
        <GlassButton
          id="btn-2"
          label="2"
          variant="number"
          onClick={() => onNumber('2')}
        />
        <GlassButton
          id="btn-3"
          label="3"
          variant="number"
          onClick={() => onNumber('3')}
        />
        <GlassButton
          id="btn-add"
          label="+"
          variant="operator"
          onClick={() => onOperator('+')}
          ariaLabel="Add"
        />

        {/* Row 5 */}
        <GlassButton
          id="btn-toggle-sign"
          label="±"
          variant="number"
          onClick={onToggleSign}
          ariaLabel="Toggle Plus/Minus"
        />
        <GlassButton
          id="btn-0"
          label="0"
          variant="number"
          onClick={() => onNumber('0')}
        />
        <GlassButton
          id="btn-decimal"
          label="."
          variant="number"
          onClick={() => onNumber('.')}
          ariaLabel="Decimal point"
        />
        <GlassButton
          id="btn-equals"
          label="="
          variant="equals"
          onClick={onEquals}
          ariaLabel="Calculate Equals"
        />
      </div>
    </div>
  );
};
