'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 right-0 w-[3px] h-full z-[100] bg-transparent pointer-events-none">
      <div 
        className="w-full bg-white transition-all duration-150 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)] origin-top" 
        style={{ height: `${progress}%` }} 
      />
    </div>
  );
}
