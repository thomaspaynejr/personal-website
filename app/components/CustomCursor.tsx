'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type HoverState = 'none' | 'normal' | 'nav';

export type CursorMode = 'dual' | 'minimal' | 'bracket';

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState<HoverState>('none');
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('bracket');

  // Exact clientX, clientY without spring lag for zero-latency click feedback
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Outer trailing halo / bracket coordinates with smooth spring physics
  const haloX = useMotionValue(-100);
  const haloY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 360, mass: 0.28 };
  const smoothHaloX = useSpring(haloX, springConfig);
  const smoothHaloY = useSpring(haloY, springConfig);

  useEffect(() => {
    const saved = localStorage.getItem('fx_cursor_mode') as CursorMode | null;
    if (saved === 'minimal' || saved === 'bracket' || saved === 'dual') {
      setTimeout(() => setCursorMode(saved), 0);
    }

    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<CursorMode>;
      if (customEvent.detail) setCursorMode(customEvent.detail);
    };
    window.addEventListener('cursor_mode_change', handleModeChange);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      // Center the dot (6px minimal offset = 12px diameter, 3px for 6px dot)
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      // Center the 32px halo/bracket (16px offset)
      haloX.set(e.clientX - 16);
      haloY.set(e.clientY - 16);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('nav a, nav button, footer a, footer button')) {
        setHoverState('nav');
      } else if (
        target.closest('a, button, input, textarea, [role="button"], label, select')
      ) {
        setHoverState('normal');
      } else {
        setHoverState('none');
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('cursor_mode_change', handleModeChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [dotX, dotY, haloX, haloY, isVisible]);

  if (!isVisible) return null;

  // Color palette for Bracket mode reactive states
  const bracketBorderColor = isMouseDown
    ? 'border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.75)]'
    : hoverState === 'normal'
    ? 'border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
    : hoverState === 'nav'
    ? 'border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
    : 'border-action/80';

  const bracketDotColor = isMouseDown
    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
    : hoverState === 'normal'
    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
    : hoverState === 'nav'
    ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]'
    : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.85)]';

  return (
    <div className="pointer-events-none hidden md:block">
      {/* 1. MINIMAL MODE: Illuminated Light Center + Bold High-Contrast Outline */}
      {cursorMode === 'minimal' && (
        <motion.div
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FFFFFF] border-[2.5px] border-[#0A0A0A] ring-[1.5px] ring-action/80 shadow-[0_0_10px_rgba(255,255,255,0.85)] z-[99999] pointer-events-none flex items-center justify-center"
          style={{ x: dotX, y: dotY }}
          animate={{
            scale: isMouseDown
              ? 0.8
              : hoverState === 'normal'
              ? 1.65
              : hoverState === 'nav'
              ? 1.9
              : 1,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
        >
          {/* Inner incandescent filament glow */}
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
              hoverState === 'normal'
                ? 'bg-emerald-300'
                : hoverState === 'nav'
                ? 'bg-sky-300'
                : 'bg-white'
            }`}
          />
        </motion.div>
      )}

      {/* 2. BRACKET MODE: Creative Tactical HUD Reticle with Dynamic Color Shifts */}
      {cursorMode === 'bracket' && (
        <>
          {/* Zero-latency Center Core */}
          <motion.div
            className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-black z-[99999] pointer-events-none transition-colors duration-150 ${bracketDotColor}`}
            style={{ x: dotX, y: dotY }}
            animate={{
              scale: isMouseDown
                ? 0.75
                : hoverState === 'normal'
                ? 1.35
                : hoverState === 'nav'
                ? 1.25
                : 1,
            }}
            transition={{ duration: 0.12 }}
          />

          {/* Reactive Rotating Corner Brackets */}
          <motion.div
            className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99998]"
            style={{ x: smoothHaloX, y: smoothHaloY }}
            animate={{
              scale: isMouseDown
                ? 0.72
                : hoverState === 'normal'
                ? 1.28
                : hoverState === 'nav'
                ? 0.88
                : 1,
              rotate: isMouseDown
                ? 135
                : hoverState === 'normal'
                ? 45
                : hoverState === 'nav'
                ? 90
                : 0,
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            {/* Top-Left */}
            <span
              className={`absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 transition-colors duration-200 ${bracketBorderColor}`}
            />
            {/* Top-Right */}
            <span
              className={`absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 transition-colors duration-200 ${bracketBorderColor}`}
            />
            {/* Bottom-Left */}
            <span
              className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 transition-colors duration-200 ${bracketBorderColor}`}
            />
            {/* Bottom-Right */}
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 transition-colors duration-200 ${bracketBorderColor}`}
            />

            {/* Subtle Crosshair Axis Ticks on Interactive Hover */}
            {hoverState !== 'none' && (
              <>
                <span
                  className={`absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-[1.5px] ${
                    hoverState === 'normal' ? 'bg-emerald-400' : 'bg-sky-400'
                  }`}
                />
                <span
                  className={`absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-[1.5px] ${
                    hoverState === 'normal' ? 'bg-emerald-400' : 'bg-sky-400'
                  }`}
                />
              </>
            )}
          </motion.div>
        </>
      )}

      {/* 3. DUAL MODE: Illuminated Center Dot + Fluid Spring Halo */}
      {cursorMode === 'dual' && (
        <>
          <motion.div
            className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-black ring-1 ring-action/70 z-[99999] pointer-events-none"
            style={{ x: dotX, y: dotY }}
            animate={{
              scale: isMouseDown
                ? 0.75
                : hoverState === 'normal'
                ? 1.4
                : hoverState === 'nav'
                ? 1.7
                : 1,
            }}
            transition={{ duration: 0.12 }}
          />
          <motion.div
            className={`fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[99998] transition-colors duration-200 ${
              hoverState === 'normal'
                ? 'border-action bg-action/15'
                : hoverState === 'nav'
                ? 'border-action/80 bg-action/20'
                : 'border-action/40 bg-transparent'
            }`}
            style={{ x: smoothHaloX, y: smoothHaloY }}
            animate={{
              scale: isMouseDown
                ? 0.8
                : hoverState === 'normal'
                ? 1.35
                : hoverState === 'nav'
                ? 0.75
                : 1,
              opacity: 1,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          />
        </>
      )}
    </div>
  );
}
