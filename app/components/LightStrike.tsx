'use client';

import React, { useEffect, useRef } from 'react';

export default function LightStrike() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      const isDark = document.documentElement.classList.contains('dark');
      
      // Clear with slight persistence
      ctx.clearRect(0, 0, width, height);

      // Randomly trigger a strike (rare frequency)
      if (Math.random() > 0.992) {
        const x = Math.random() * width;
        const strikeWidth = 1 + Math.random() * 3;
        
        // Strike style
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = strikeWidth;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        // Jagged path
        let currentY = 0;
        let currentX = x;
        while (currentY < height) {
          currentY += Math.random() * 100;
          currentX += (Math.random() - 0.5) * 40;
          ctx.lineTo(currentX, currentY);
        }
        
        ctx.stroke();

        // Subtle flash effect
        if (Math.random() > 0.5) {
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)';
          ctx.fillRect(0, 0, width, height);
        }
      }
    };

    let animationId: number;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-50"
    />
  );
}
