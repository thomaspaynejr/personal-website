'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function ArticleReadingProgress() {
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(progress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const currentProgress = Math.min(Math.max(window.scrollY / docHeight, 0), 1);
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-[999] pointer-events-none">
      <motion.div
        className="h-full bg-action origin-left"
        style={{ scaleX }}
      />
    </div>
  );
}
