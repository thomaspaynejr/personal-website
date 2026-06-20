'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type HoverState = 'none' | 'normal' | 'nav';

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState<HoverState>('none');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Buttery smooth spring physics for the trailing effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset by 8px (half of w-4 h-4) to center the cursor
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);

      const target = e.target as HTMLElement;
      
      if (target.closest('nav a, nav button, footer a, footer button')) {
        setHoverState('nav');
      } else if (target.closest('a, button, input, textarea, [role="button"]')) {
        setHoverState('normal');
      } else {
        setHoverState('none');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  // Determine animation properties based on hover state
  let scale = 1;
  let bgColor = 'transparent';

  if (hoverState === 'normal') {
    scale = 2.5;
    bgColor = 'var(--color-action-10, rgba(var(--color-action), 0.1))'; // using tailwind color mapping equivalent if possible, or fallback via CSS class
  } else if (hoverState === 'nav') {
    scale = 0.5; // Reduce size by half
    bgColor = 'var(--color-foreground)'; // Solid dot for nav
  }

  return (
    <motion.div
      className={`fixed top-0 left-0 w-4 h-4 rounded-full border border-action pointer-events-none z-[9999] hidden md:block will-change-transform ${
        hoverState === 'normal' ? 'bg-action/10' : hoverState === 'nav' ? 'bg-action' : 'bg-transparent'
      }`}
      style={{ x, y }}
      animate={{ scale }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  );
}
