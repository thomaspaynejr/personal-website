'use client';

import React, { useEffect, useRef } from 'react';

interface BoltSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Bolt {
  segments: BoltSegment[];
  width: number;
  opacity: number;
  isMain: boolean;
}

export default function LightStrike() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeBoltsRef = useRef<Bolt[]>([]);
  const flashOpacityRef = useRef(0);

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

    const createBolt = (startX: number, isMain: boolean): Bolt => {
      const segments: BoltSegment[] = [];
      let currX = startX;
      let currY = 0;
      const segmentCount = 15 + Math.random() * 10;
      const segmentHeight = height / segmentCount;

      for (let i = 0; i < segmentCount; i++) {
        const nextY = currY + segmentHeight;
        const nextX = currX + (Math.random() - 0.5) * (isMain ? 80 : 40);
        segments.push({ x1: currX, y1: currY, x2: nextX, y2: nextY });
        currX = nextX;
        currY = nextY;
      }

      return {
        segments,
        width: isMain ? 1.5 + Math.random() * 1.5 : 0.5 + Math.random() * 0.5,
        opacity: isMain ? 0.3 : 0.1,
        isMain
      };
    };

    const triggerStrike = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const mainX = Math.random() * width;
      
      const bolts: Bolt[] = [];
      // Main bolt
      bolts.push(createBolt(mainX, true));
      
      // 2-3 Distant bolts
      const distantCount = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < distantCount; i++) {
        const offsetX = (Math.random() - 0.5) * 600;
        bolts.push(createBolt(mainX + offsetX, false));
      }

      activeBoltsRef.current = bolts;
      flashOpacityRef.current = isDark ? 0.15 : 0.08;

      // Flicker effect: clear after 60ms, then maybe show again briefly
      setTimeout(() => {
        activeBoltsRef.current = [];
        flashOpacityRef.current = 0;
        
        // Second flicker
        if (Math.random() > 0.4) {
          setTimeout(() => {
            activeBoltsRef.current = bolts;
            flashOpacityRef.current = isDark ? 0.08 : 0.04;
            setTimeout(() => {
              activeBoltsRef.current = [];
              flashOpacityRef.current = 0;
            }, 50);
          }, 60);
        }
      }, 80);
    };

    // Trigger immediately and then every 5 seconds
    triggerStrike();
    const intervalId = setInterval(triggerStrike, 5000);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');

      // Draw flash
      if (flashOpacityRef.current > 0) {
        ctx.fillStyle = isDark 
          ? `rgba(255, 255, 255, ${flashOpacityRef.current})` 
          : `rgba(0, 0, 0, ${flashOpacityRef.current})`;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw bolts
      activeBoltsRef.current.forEach(bolt => {
        ctx.beginPath();
        // Increased opacity for visibility
        const opacity = bolt.isMain ? 0.6 : 0.2;
        ctx.strokeStyle = isDark 
          ? `rgba(255, 255, 255, ${opacity})` 
          : `rgba(0, 0, 0, ${opacity})`;
        ctx.lineWidth = bolt.width;
        
        bolt.segments.forEach(seg => {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();
      });
    };

    let animationId: number;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[10] opacity-100"
    />
  );
}
