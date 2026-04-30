'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 right-0 w-[3px] h-full z-[100] bg-transparent pointer-events-none">
      <motion.div 
        className="w-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] origin-top"
        style={{ scaleY }}
      />
    </div>
  );
}
