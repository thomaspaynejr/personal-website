'use client';

import React, { useRef } from 'react';
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform,
  MotionValue
} from 'framer-motion';
import { 
  SiNextdotjs, 
  SiReact, 
  SiTypescript, 
  SiTailwindcss, 
  SiSupabase, 
  SiFirebase, 
  SiNodedotjs 
} from 'react-icons/si';

interface IconProps {
  name: string;
  mouseX: MotionValue<number>;
}

const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
  'Next.js': { icon: SiNextdotjs, color: '#ffffff' },
  'React': { icon: SiReact, color: '#61DAFB' },
  'TypeScript': { icon: SiTypescript, color: '#3178C6' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
  'Tailwind': { icon: SiTailwindcss, color: '#06B6D4' },
  'Supabase': { icon: SiSupabase, color: '#3ECF8E' },
  'Firebase': { icon: SiFirebase, color: '#FFCA28' },
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
};

function TechIconItem({ name, mouseX }: IconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const iconData = iconMap[name];

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Base size is 24px (w-6), magnified to 48px (w-12)
  const widthSync = useTransform(distance, [-100, 0, 100], [24, 48, 24]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  if (!iconData) {
    return (
      <motion.div 
        ref={ref} 
        style={{ width }}
        className="aspect-square rounded-md bg-card/50 border border-border-custom/50 flex items-center justify-center"
      >
        <span className="text-[7px] font-bold text-accent">{name.substring(0, 2).toUpperCase()}</span>
      </motion.div>
    );
  }

  const Icon = iconData.icon;

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="group relative aspect-square rounded-md bg-card border border-border-custom/50 flex items-center justify-center transition-colors duration-300 hover:border-action/50 shadow-sm"
    >
      <Icon 
        className="w-1/2 h-1/2 opacity-90 transition-opacity group-hover:opacity-100"
        style={{ color: iconData.color }}
      />
      
      {/* Label Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-50">
        <span className="text-[7px] font-bold text-action uppercase tracking-widest whitespace-nowrap bg-background/90 backdrop-blur-sm px-2 py-1 rounded border border-border-custom/50 shadow-xl">
          {name}
        </span>
      </div>
    </motion.div>
  );
}

export default function TechIcon({ items, name }: { items?: string[], name?: string }) {
  const mouseX = useMotionValue(Infinity);
  
  // If items is provided, render the dock
  if (items && Array.isArray(items)) {
    return (
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-1.5 h-12 px-2"
      >
        {items.map((item) => (
          <TechIconItem key={item} name={item} mouseX={mouseX} />
        ))}
      </motion.div>
    );
  }

  // Fallback for single icon if someone still uses <TechIcon name="..." />
  if (name) {
    return (
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end h-12 px-2"
      >
        <TechIconItem name={name} mouseX={mouseX} />
      </motion.div>
    );
  }

  return null;
}
