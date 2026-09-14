import React, { useState, useEffect, useRef } from 'react';
import { X, Activity, Circle, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface VisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VisualizerTab = 'trig' | 'powers' | 'pi-circle';

export const VisualizerModal: React.FC<VisualizerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<VisualizerTab>('trig');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trig Controls
  const [trigFunc, setTrigFunc] = useState<'sin' | 'cos' | 'tan'>('sin');
  const [amplitude, setAmplitude] = useState<number>(50);
  const [frequency, setFrequency] = useState<number>(2);
  const [phase, setPhase] = useState<number>(0);

  // Powers Controls
  const [powerMode, setPowerMode] = useState<'square' | 'cube' | 'sqrt'>('square');
  const [powerScale, setPowerScale] = useState<number>(1);

  // Pi Circle Controls
  const [circleRadius, setCircleRadius] = useState<number>(60);

  // Animation Loop for live movement
  useEffect(() => {
    if (!isOpen) return;
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark glass canvas tone
      ctx.clearRect(0, 0, width, height);

      // Draw coordinate grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Main Axes
      const centerY = height / 2;
      const centerX = width / 2;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      // X-Axis
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      // Y-Axis
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      if (activeTab === 'trig') {
        // Draw Wave
        ctx.lineWidth = 4;
        ctx.strokeStyle = trigFunc === 'sin' ? '#38bdf8' : trigFunc === 'cos' ? '#34d399' : '#f472b6';
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const t = (x - centerX) * 0.02 * frequency + phase;
          let yVal = 0;
          if (trigFunc === 'sin') {
            yVal = Math.sin(t) * amplitude;
          } else if (trigFunc === 'cos') {
            yVal = Math.cos(t) * amplitude;
          } else {
            // tan
            yVal = Math.tan(t) * (amplitude * 0.4);
            // clamp for visual sanity
            if (yVal > height / 2) yVal = height / 2;
            if (yVal < -height / 2) yVal = -height / 2;
          }

          const y = centerY - yVal;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw animated surfer particle at center
        const tCenter = phase;
        const currentY = centerY - (trigFunc === 'sin' ? Math.sin(tCenter) : trigFunc === 'cos' ? Math.cos(tCenter) : Math.tan(tCenter)) * amplitude;
        
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(centerX, currentY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } 
      else if (activeTab === 'powers') {
        // Draw Power Curve
        ctx.lineWidth = 4;
        ctx.strokeStyle = powerMode === 'square' ? '#ec4899' : powerMode === 'cube' ? '#a855f7' : '#06b6d4';
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        for (let px = -width / 2; px <= width / 2; px += 2) {
          const x = px * 0.04 * powerScale;
          let y = 0;
          if (powerMode === 'square') {
            y = Math.pow(x, 2) * 20;
          } else if (powerMode === 'cube') {
            y = Math.pow(x, 3) * 6;
          } else {
            // sqrt
            y = x >= 0 ? Math.sqrt(x) * 45 : 0;
          }

          const canvasX = centerX + px;
          const canvasY = centerY - y;

          if (px === -width / 2) {
            ctx.moveTo(canvasX, canvasY);
          } else {
            ctx.lineTo(canvasX, canvasY);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      else if (activeTab === 'pi-circle') {
        // Draw Interactive Pi Circle & Circumference
        const cX = width * 0.35;
        const cY = height / 2;

        // Circle
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cX, cY, circleRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Radius Line
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.lineTo(cX + circleRadius, cY);
        ctx.stroke();

        // Radius label
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Fredoka, sans-serif';
        ctx.fillText(`r = ${circleRadius}px`, cX + circleRadius / 3, cY - 8);

        // Center dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cX, cY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Unrolled Circumference Tape on right
        const circ = 2 * Math.PI * circleRadius;
        const tapeX = width * 0.65;
        const tapeStartY = centerY - 100;
        const tapeEndY = tapeStartY + Math.min(circ * 0.45, 200);

        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(tapeX, tapeStartY);
        ctx.lineTo(tapeX, tapeEndY);
        ctx.stroke();

        ctx.fillStyle = '#ec4899';
        ctx.fillText(`Unrolled Rim: C = 2 × π × r`, tapeX - 10, tapeStartY - 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px sans-serif';
        ctx.fillText(`≈ ${(circ).toFixed(1)} px`, tapeX + 10, (tapeStartY + tapeEndY) / 2);
      }
    };

    render();
    // Gentle animation for wave
    const interval = setInterval(() => {
      setPhase((prev) => prev + 0.05);
    }, 30);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, activeTab, trigFunc, amplitude, frequency, phase, powerMode, powerScale, circleRadius]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 10 }}
        className="relative w-full max-w-4xl rounded-3xl bg-[#0b101e]/95 border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col text-white font-['Plus_Jakarta_Sans',sans-serif]"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Fredoka',sans-serif] text-white flex items-center gap-2">
                Kid Math Wave & Shape Visualizer
              </h2>
              <p className="text-xs text-slate-400">See how equations turn into waves, rocket curves, and circles!</p>
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

        {/* Tab Navigator */}
        <div className="flex items-center gap-2 p-3 bg-black/20 border-b border-white/10 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('trig')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'trig'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-xs'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-white/10'
            }`}
          >
            <Activity className="w-4 h-4" />
            Trigonometric Waves (sin / cos)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('powers')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'powers'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 shadow-xs'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            Rocket Curves (x², x³, √x)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pi-circle')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'pi-circle'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-xs'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-white/10'
            }`}
          >
            <Circle className="w-4 h-4" />
            The Pi Circle Explorer
          </button>
        </div>

        {/* Visualizer Canvas & Controls */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Canvas Box */}
          <div className="md:col-span-8 relative w-full h-[280px] sm:h-[320px] rounded-2xl bg-black/40 border border-white/15 overflow-hidden flex items-center justify-center shadow-inner">
            <canvas
              ref={canvasRef}
              width={560}
              height={320}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Interactive Controls */}
          <div className="md:col-span-4 space-y-4">
            {activeTab === 'trig' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-cyan-300 font-bold block mb-1.5">Function</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['sin', 'cos', 'tan'] as const).map((fn) => (
                      <button
                        key={fn}
                        type="button"
                        onClick={() => setTrigFunc(fn)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                          trigFunc === fn
                            ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {fn}(x)
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Wave Height (Amplitude)</span>
                    <span className="font-mono text-cyan-300">{amplitude}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    value={amplitude}
                    onChange={(e) => setAmplitude(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Wave Speed (Frequency)</span>
                    <span className="font-mono text-cyan-300">{frequency}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-200">
                  🌊 <span className="font-semibold">Notice:</span> Higher frequency creates tighter ripples, just like musical notes turning into higher pitches!
                </div>
              </div>
            )}

            {activeTab === 'powers' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-pink-300 font-bold block mb-1.5">Equation Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'square', label: 'x² (Square)' },
                      { id: 'cube', label: 'x³ (Cube)' },
                      { id: 'sqrt', label: '√x (Root)' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPowerMode(item.id as 'square' | 'cube' | 'sqrt')}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                          powerMode === item.id
                            ? 'bg-pink-500 text-white font-extrabold shadow-md'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Zoom Multiplier</span>
                    <span className="font-mono text-pink-300">{powerScale}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={powerScale}
                    onChange={(e) => setPowerScale(Number(e.target.value))}
                    className="w-full accent-pink-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-400/20 text-xs text-pink-200">
                  🚀 <span className="font-semibold">Look how fast it shoots up!</span> Power curves grow faster and faster because multiplying multiplies growth!
                </div>
              </div>
            )}

            {activeTab === 'pi-circle' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Circle Radius (r)</span>
                    <span className="font-mono text-amber-300">{circleRadius} px</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="90"
                    value={circleRadius}
                    onChange={(e) => setCircleRadius(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/60">Diameter (2r):</span>
                    <span className="font-bold text-sky-300">{circleRadius * 2} px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Circumference (2πr):</span>
                    <span className="font-bold text-pink-300">{(2 * Math.PI * circleRadius).toFixed(2)} px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Circle Area (πr²):</span>
                    <span className="font-bold text-amber-300">{(Math.PI * circleRadius * circleRadius).toFixed(1)} px²</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200">
                  🍕 <span className="font-semibold">The Pi Secret:</span> No matter how big or small your circle is, Circumference ÷ Diameter always equals 3.14159... (Pi)!
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
