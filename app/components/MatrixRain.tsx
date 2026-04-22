'use client';

import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // CURATED SYMBOL SET (Greek, Phoenician, Katakana)
    const phoenician = ['𐤀','𐤂','𐤃','𐤈','𐤉','𐤋','𐤎','𐤑','𐤒','𐤓','𐤔'];
    const greek = ['Γ','Δ','Θ','Λ','Ξ','Π','Σ','Φ','Ψ','Ω'];
    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');
    const tech = ['∞','∑','∏','∂','∆','∇','∫','∬','∭','☥','☦','☯','☰','☸','⚡','⚙','⚛'];
    
    const chars = [...phoenician, ...greek, ...katakana, ...tech];
    const fontSize = 22;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newColumns = Math.floor(width / fontSize);
      
      if (newColumns > drops.length) {
        const additional = newColumns - drops.length;
        for (let i = 0; i < additional; i++) {
          drops.push(Math.random() * -100);
        }
      }
      columns = newColumns;
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      const isDark = document.documentElement.classList.contains('dark');
      
      // Solid background fill for trails
      ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (isDark) {
          ctx.fillStyle = Math.random() > 0.96 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
        } else {
          ctx.fillStyle = Math.random() > 0.96 ? '#000000' : 'rgba(0, 0, 0, 0.4)';
        }
        
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        // Slowed down by 25% (0.75 -> 0.55)
        drops[i] += 0.55; 
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
      key="matrix-rain-v5"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-90 z-[5]"
    />
  );
}
