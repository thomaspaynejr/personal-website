'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  lat: number;
  lng: number;
  isLand?: boolean;
}

interface GlobeProps {
  activeLocation?: { lat: number; lng: number } | null;
}

export default function Globe({ activeLocation }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isDark, setIsDark] = useState(true);
  
  const baseRotationY = useRef(0);
  const travelRotationY = useRef(0);
  const travelRotationX = useRef(0);
  const targetTravelY = useRef(0);
  const targetTravelX = useRef(0);

  useEffect(() => {
    // Theme detection
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const newPoints: Point[] = [];
    const count = 2000; 
    
    const isLand = (lat: number, lng: number) => {
      if (lat > 12 && lat < 72 && lng > -168 && lng < -52) return true; // North America
      if (lat > -56 && lat < 12 && lng > -82 && lng < -34) return true; // South America
      if (lat > 0 && lat < 78 && lng > -10 && lng < 190) return true; // Eurasia
      if (lat > -35 && lat < 38 && lng > -20 && lng < 52) return true; // Africa
      if (lat > -48 && lat < -10 && lng > 112 && lng < 154) return true; // Australia
      if (lat < -65) return true; // Antarctica
      return false;
    };

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);
      const lat = 90 - (phi * 180) / Math.PI;
      const lng = ((theta * 180) / Math.PI) % 360 - 180;
      newPoints.push({ x, y, z, lat, lng, isLand: isLand(lat, lng) });
    }
    setPoints(newPoints);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeLocation) {
      targetTravelY.current = (-activeLocation.lng * Math.PI) / 180;
      targetTravelX.current = (activeLocation.lat * Math.PI) / 180;
    }
  }, [activeLocation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.85;

      baseRotationY.current += 0.003;
      const lerpSpeed = 0.05;
      travelRotationY.current += (targetTravelY.current - travelRotationY.current) * lerpSpeed;
      travelRotationX.current += (targetTravelX.current - travelRotationX.current) * lerpSpeed;

      const currentY = baseRotationY.current + travelRotationY.current;
      const currentX = travelRotationX.current;

      const cosY = Math.cos(currentY);
      const sinY = Math.sin(currentY);
      const cosX = Math.cos(currentX);
      const sinX = Math.sin(currentX);

      const projected = points.map(p => {
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;
        let y1 = p.y;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;
        let x2 = x1;
        const scale = 2.5 / (z2 + 4);
        const px = x2 * scale * radius + centerX;
        const py = y2 * scale * radius + centerY;
        return { px, py, z: z2, isLand: p.isLand, lat: p.lat, lng: p.lng };
      });

      projected.sort((a, b) => b.z - a.z);

      const dotColor = isDark ? '255, 255, 255' : '0, 0, 0';

      projected.forEach(p => {
        const isFront = p.z < 0;
        let isHighlighted = false;
        if (activeLocation) {
          const dLat = Math.abs(p.lat - activeLocation.lat);
          const dLng = Math.abs(p.lng - activeLocation.lng) % 360;
          const dist = Math.sqrt(dLat * dLat + Math.min(dLng, 360 - dLng) ** 2);
          if (dist < 8) isHighlighted = true;
        }

        const size = isHighlighted ? 3.5 : p.isLand ? 1.2 : 0.6;
        const opacity = isFront ? (isHighlighted ? 1 : 0.6) : 0.1;
        
        ctx.beginPath();
        ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
        
        if (isHighlighted) {
          ctx.fillStyle = isDark ? 'white' : 'black';
          ctx.shadowBlur = 10;
          ctx.shadowColor = isDark ? 'white' : 'black';
        } else {
          ctx.fillStyle = `rgba(${dotColor}, ${opacity * (p.isLand ? 1 : 0.4)})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [points, activeLocation, isDark]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={600} height={600} className="w-full h-full mix-blend-multiply dark:mix-blend-screen" />
    </div>
  );
}
