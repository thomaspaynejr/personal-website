'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type HoverState = 'none' | 'normal' | 'nav';

export type CursorMode = 'dual' | 'minimal' | 'bracket';

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState<HoverState>('none');
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('dual');

  // Exact clientX, clientY without spring lag for zero-latency click feedback
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Outer trailing halo coordinates with smooth spring physics
  const haloX = useMotionValue(-100);
  const haloY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.3 };
  const smoothHaloX = useSpring(haloX, springConfig);
  const smoothHaloY = useSpring(haloY, springConfig);

  useEffect(() => {
    const saved = localStorage.getItem('fx_cursor_mode') as CursorMode;
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

      // Center the dot
      dotX.set(e.clientX - 2);
      dotY.set(e.clientY - 2);

      // Center the 28px halo (14px offset)
      haloX.set(e.clientX - 14);
      haloY.set(e.clientY - 14);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('nav a, nav button, footer a, footer button')) {
        setHoverState('nav');
      } else if (target.closest('a, button, input, textarea, [role="button"], label, select')) {
        setHoverState('normal');
      } else {
        setHoverState('none');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('cursor_mode_change', handleModeChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [dotX, dotY, haloX, haloY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none hidden md:block">
      {/* Precision Instant Center Dot (Zero-lag, 100% click accuracy) */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full bg-action z-[99999] pointer-events-none ${
          cursorMode === 'minimal' ? 'w-2 h-2' : 'w-1 h-1'
        }`}
        style={{ x: dotX, y: dotY }}
        animate={{
          scale:
            cursorMode === 'minimal'
              ? hoverState === 'normal'
                ? 2.2
                : hoverState === 'nav'
                ? 2.8
                : 1
              : hoverState === 'normal'
              ? 1.5
              : hoverState === 'nav'
              ? 2
              : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Trailing Fluid Halo Ring (Dual Mode) */}
      {cursorMode === 'dual' && (
        <motion.div
          className={`fixed top-0 left-0 w-7 h-7 rounded-full border pointer-events-none z-[99998] transition-colors duration-200 ${
            hoverState === 'normal'
              ? 'border-action bg-action/15'
              : hoverState === 'nav'
              ? 'border-action/80 bg-action/20'
              : 'border-action/40 bg-transparent'
          }`}
          style={{ x: smoothHaloX, y: smoothHaloY }}
          animate={{
            scale: hoverState === 'normal' ? 1.4 : hoverState === 'nav' ? 0.75 : 1,
            opacity: 1,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />
      )}

      {/* Tactical HUD Corner Brackets (Bracket Mode) */}
      {cursorMode === 'bracket' && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99998]"
          style={{ x: smoothHaloX, y: smoothHaloY }}
          animate={{
            scale: hoverState === 'normal' ? 1.3 : hoverState === 'nav' ? 0.8 : 1,
            rotate: hoverState === 'normal' ? 45 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          {/* Top-Left */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-action/60" />
          {/* Top-Right */}
          <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-action/60" />
          {/* Bottom-Left */}
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-action/60" />
          {/* Bottom-Right */}
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-action/60" />
        </motion.div>
      )}
    </div>
  );
}
