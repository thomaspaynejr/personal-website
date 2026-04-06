'use client';

import React, { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Ancient Knowledge Characters: Greek Alphabet and Technical Symbols
    const chars = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ∞ΣΠ∫∇∆∏∑⊕⊗⊙⊚⊛⊜⊝♰♱☥☦☧☨☩☫☬☯☰☱☲☳☴☵☶☷☸'.split('');
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    
    // Track the Y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Random start positions
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      const isDark = document.documentElement.classList.contains('dark');
      
      // Clear with simple transparency
      ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (isDark) {
          ctx.fillStyle = Math.random() > 0.95 ? '#FFFFFF' : '#333333';
        } else {
          ctx.fillStyle = Math.random() > 0.95 ? '#000000' : '#CCCCCC';
        }
        
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50); // Slowed down from 33ms to 50ms for a calmer feel

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30 z-[-1]"
    />
  );
}
