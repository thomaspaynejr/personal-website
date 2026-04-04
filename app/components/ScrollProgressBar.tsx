'use client';

export default function ScrollProgressBar() {
  return (
    <div className="fixed top-0 right-0 w-[3px] h-full z-[100] bg-transparent pointer-events-none">
      <div 
        className="w-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] origin-top scroll-progress-bar" 
      />
      <style jsx global>{`
        @keyframes grow-y {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        
        .scroll-progress-bar {
          height: 100%;
          animation: grow-y linear;
          animation-timeline: scroll();
        }
      `}</style>
    </div>
  );
}
