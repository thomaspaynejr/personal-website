'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 w-4 h-4 rounded-full border border-action pointer-events-none z-[9999] transition-transform duration-200 ease-out hidden md:block ${isPointer ? 'scale-[2.5] bg-action/10' : 'scale-100'}`}
      style={{ 
        transform: `translate(${position.x - 8}px, ${position.y - 8}px) scale(${isPointer ? 2.5 : 1})`,
      }}
    />
  );
}
