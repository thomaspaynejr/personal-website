'use client';

import { useTheme } from '@/app/providers';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-14 h-7" />; 
  }

  const isDark = theme === 'dark';

  return (
    <div 
      className="relative w-14 h-7 bg-black/10 dark:bg-white/10 border border-border-custom rounded-full p-1 cursor-pointer flex items-center transition-colors duration-300"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {/* Background Icons for Reference */}
      <div className="absolute inset-0 flex justify-between px-1.5 items-center pointer-events-none opacity-20">
        <Sun size={12} className="text-[#FF8C00]" />
        <Moon size={12} className="text-white" />
      </div>

      {/* Sliding Knob */}
      <motion.div 
        className="relative z-10 w-5 h-5 bg-foreground rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)] dark:shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        animate={{ 
          x: isDark ? 28 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon size={10} className="text-background fill-background" />
        ) : (
          <Sun size={10} className="text-orange-500 fill-orange-500" />
        )}
      </motion.div>
    </div>
  );
}