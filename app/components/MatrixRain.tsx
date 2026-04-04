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

    // Characters: Mix of numbers, symbols, and letters
    const chars = '01ABCDEFHIJKLMNOPQRSTUVWXYZ$#@&*%'.split('');
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
      // Clear the canvas with transparency to allow the theme background to show through
      ctx.clearRect(0, 0, width, height);

      // Set text style
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the stream is brighter white
        ctx.fillStyle = Math.random() > 0.98 ? '#FFFFFF' : '#888888';
        
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33); // ~30fps for that technical "stutter" feel

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30 z-0"
      style={{ filter: 'blur(0.4px)' }}
    />
  );
}
