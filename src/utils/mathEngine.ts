import { AngleMode } from '../types';

export interface CalculationResult {
  success: boolean;
  value?: number;
  formatted?: string;
  error?: string;
  steps?: string[];
}

// Factorial helper (safe up to 170 for JS Number)
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("Factorial is only for non-negative whole numbers");
  if (n > 170) throw new Error("Number too large for factorial");
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function formatResultNumber(num: number): string {
  if (Number.isNaN(num)) return "Undefined";
  if (!Number.isFinite(num)) return num > 0 ? "Infinity" : "-Infinity";

  // Check if it's very close to an integer
  if (Math.abs(num - Math.round(num)) < 1e-12) {
    return Math.round(num).toString();
  }

  // If very large or very small, use exponential or neat fixed
  const absNum = Math.abs(num);
  if (absNum >= 1e12 || (absNum > 0 && absNum < 1e-7)) {
    return num.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Format to up to 8 decimal places, removing trailing zeros
  const fixed = num.toFixed(8);
  return parseFloat(fixed).toString();
}

export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): CalculationResult {
  if (!expr || expr.trim() === '') {
    return { success: true, value: 0, formatted: '0', steps: ['Empty expression'] };
  }

  try {
    let clean = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/,/g, '');

    // Replace constants
    clean = clean.replace(/π/g, `(${Math.PI})`);
    clean = clean.replace(/\be\b/g, `(${Math.E})`);

    // Handle percentage like "50%" -> "(50/100)"
    clean = clean.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Handle factorial symbol like "5!" -> "fact(5)"
    clean = clean.replace(/(\d+(\.\d+)?|\([^()]+\))!/g, 'fact($1)');

    // Handle square / cube roots
    clean = clean.replace(/√\(([^)]+)\)/g, 'sqrt($1)');
    clean = clean.replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)');
    clean = clean.replace(/∛\(([^)]+)\)/g, 'cbrt($1)');
    clean = clean.replace(/∛(\d+(\.\d+)?)/g, 'cbrt($1)');

    // Handle absolute value |x| -> abs(x)
    clean = clean.replace(/\|([^|]+)\|/g, 'abs($1)');

    // Handle power notation ^ -> **
    clean = clean.replace(/\^/g, '**');

    // Handle implicit multiplication like 2(3) -> 2*(3) or (2)(3) -> (2)*(3)
    clean = clean.replace(/(\d)\(/g, '$1*(');
    clean = clean.replace(/\)(\d)/g, ')*$1');
    clean = clean.replace(/\)\(/g, ')*(');
    clean = clean.replace(/(\d)(sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt|abs|fact)/g, '$1*$2');

    // Angle conversion factor for trig
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const fromRad = (rad: number) => (rad * 180) / Math.PI;

    // Custom environment functions
    const env = {
      sin: (x: number) => {
        const angle = angleMode === 'DEG' ? toRad(x) : x;
        // Fix floating point precision for common angles like sin(180) = 0
        const val = Math.sin(angle);
        return Math.abs(val) < 1e-12 ? 0 : val;
      },
      cos: (x: number) => {
        const angle = angleMode === 'DEG' ? toRad(x) : x;
        const val = Math.cos(angle);
        return Math.abs(val) < 1e-12 ? 0 : val;
      },
      tan: (x: number) => {
        const angle = angleMode === 'DEG' ? toRad(x) : x;
        if (angleMode === 'DEG' && Math.abs(x % 180) === 90) {
          throw new Error("tan(90°) is undefined (infinite slope)");
        }
        const val = Math.tan(angle);
        return Math.abs(val) < 1e-12 ? 0 : val;
      },
      asin: (x: number) => {
        if (x < -1 || x > 1) throw new Error("asin domain is -1 to +1");
        const rad = Math.asin(x);
        return angleMode === 'DEG' ? fromRad(rad) : rad;
      },
      acos: (x: number) => {
        if (x < -1 || x > 1) throw new Error("acos domain is -1 to +1");
        const rad = Math.acos(x);
        return angleMode === 'DEG' ? fromRad(rad) : rad;
      },
      atan: (x: number) => {
        const rad = Math.atan(x);
        return angleMode === 'DEG' ? fromRad(rad) : rad;
      },
      sqrt: (x: number) => {
        if (x < 0) throw new Error("Cannot take square root of negative number in real math");
        return Math.sqrt(x);
      },
      cbrt: (x: number) => Math.cbrt(x),
      log: (x: number) => {
        if (x <= 0) throw new Error("Logarithm requires positive number (> 0)");
        return Math.log10(x);
      },
      ln: (x: number) => {
        if (x <= 0) throw new Error("Natural log requires positive number (> 0)");
        return Math.log(x);
      },
      abs: (x: number) => Math.abs(x),
      fact: (x: number) => factorial(x),
      PI: Math.PI,
      E: Math.E,
    };

    // Safe Function evaluation
    const keys = Object.keys(env);
    const values = Object.values(env);
    // Sanitize string to allow only safe tokens
    const validTokens = /^[0-9+\-*/().\s*^ePIEa-z_]*$/i;
    if (!validTokens.test(clean)) {
      return { success: false, error: "Invalid math character" };
    }

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(...keys, `"use strict"; return (${clean});`);
    const num = fn(...values);

    if (typeof num !== 'number' || Number.isNaN(num)) {
      return { success: false, error: "Math Error" };
    }

    const formatted = formatResultNumber(num);
    
    // Generate basic learning steps for kids
    const steps: string[] = [];
    if (expr.includes('^') || expr.includes('**')) {
      steps.push("1. Calculated powers (Exponents)");
    }
    if (expr.includes('sin') || expr.includes('cos') || expr.includes('tan')) {
      steps.push(`2. Evaluated Trigonometric values (in ${angleMode} mode)`);
    }
    if (expr.includes('√') || expr.includes('sqrt')) {
      steps.push("3. Found square/cube roots");
    }
    if (expr.includes('×') || expr.includes('*') || expr.includes('÷') || expr.includes('/')) {
      steps.push("4. Performed Multiplications & Divisions (left to right)");
    }
    if (expr.includes('+') || expr.includes('-')) {
      steps.push("5. Performed Additions & Subtractions");
    }
    if (steps.length === 0) {
      steps.push("Direct value computed");
    }

    return {
      success: true,
      value: num,
      formatted,
      steps
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Calculation error";
    return { success: false, error: msg.replace(/.*return /, '') };
  }
}
