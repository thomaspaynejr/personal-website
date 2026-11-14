'use client';

import { useTheme, COLORWAYS } from '@/app/providers';
import { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Palette, Check, MousePointer, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CursorMode } from './CustomCursor';
import type { AudioProfile } from './TerminalHUD';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('minimal');
  const [audioProfile, setAudioProfile] = useState<AudioProfile>('haptic');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, colorway, setColorway } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const savedCursor = localStorage.getItem('fx_cursor_mode') as CursorMode | null;
      if (savedCursor === 'minimal' || savedCursor === 'bracket' || savedCursor === 'dual') {
        setCursorMode(savedCursor);
      }
      const savedProfile = localStorage.getItem('fx_terminal_audio_profile') as AudioProfile | null;
      if (savedProfile) {
        setAudioProfile(savedProfile);
      }
      const savedAudio = localStorage.getItem('fx_terminal_audio');
      if (savedAudio !== null) {
        setAudioEnabled(savedAudio === 'true');
      }
    }, 0);

    const handleCursorSync = (e: Event) => {
      const detail = (e as CustomEvent<CursorMode>).detail;
      if (detail) setCursorMode(detail);
    };
    const handleAudioSync = (e: Event) => {
      const detail = (e as CustomEvent<{ enabled: boolean; profile: AudioProfile }>).detail;
      if (detail) {
        setAudioEnabled(detail.enabled);
        setAudioProfile(detail.profile);
      }
    };

    window.addEventListener('cursor_mode_change', handleCursorSync);
    window.addEventListener('audio_profile_change', handleAudioSync);

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('cursor_mode_change', handleCursorSync);
      window.removeEventListener('audio_profile_change', handleAudioSync);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!mounted) {
    return <div className="w-24 h-7" />;
  }

  const isDark = theme === 'dark';
  const activeColorway = COLORWAYS.find((c) => c.id === colorway) || COLORWAYS[0];

  const handleSelectCursor = (mode: CursorMode) => {
    setCursorMode(mode);
    localStorage.setItem('fx_cursor_mode', mode);
    window.dispatchEvent(new CustomEvent('cursor_mode_change', { detail: mode }));
  };

  const handleSelectAudio = (profile: AudioProfile | 'off') => {
    if (profile === 'off') {
      setAudioEnabled(false);
      localStorage.setItem('fx_terminal_audio', 'false');
      window.dispatchEvent(
        new CustomEvent('audio_profile_change', {
          detail: { enabled: false, profile: audioProfile },
        })
      );
    } else {
      setAudioEnabled(true);
      setAudioProfile(profile);
      localStorage.setItem('fx_terminal_audio', 'true');
      localStorage.setItem('fx_terminal_audio_profile', profile);
      window.dispatchEvent(
        new CustomEvent('audio_profile_change', {
          detail: { enabled: true, profile },
        })
      );
    }
  };

  return (
    <div className="relative flex items-center gap-2" ref={menuRef}>
      {/* Colorway & Sensory Studio Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-card border border-border-custom hover:border-action transition-all text-[9px] font-bold uppercase tracking-wider text-accent hover:text-foreground"
        title="Colorways, Cursor & Audio Studio"
      >
        <span
          className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
          style={{ backgroundColor: activeColorway.accentHex }}
        />
        <Palette size={11} className="text-action" />
        <span className="hidden sm:inline">{activeColorway.id}</span>
      </button>

      {/* Light / Dark Mode Switch */}
      <div
        className="relative w-14 h-7 bg-stone-200 dark:bg-[#111111] border border-border-custom rounded-full p-1 cursor-pointer flex items-center transition-colors duration-300"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        title="Toggle Dark / Light Mode"
      >
        <div className="absolute inset-0 flex justify-between px-1.5 items-center pointer-events-none opacity-15">
          <Sun size={12} className="text-[#FFA500]" />
          <Moon size={12} className="text-white" />
        </div>

        <motion.div
          className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
          style={{
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
          }}
          animate={{
            x: isDark ? 28 : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {isDark ? (
            <Moon size={10} className="text-white fill-white" />
          ) : (
            <Sun size={10} className="text-[#FFA500] fill-[#FFA500]" />
          )}
        </motion.div>
      </div>

      {/* Popover Studio Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-10 w-72 bg-card/95 backdrop-blur-xl border border-border-custom rounded-2xl shadow-2xl p-3.5 z-[100] space-y-4 font-mono"
          >
            {/* Section 1: Colorways */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-accent border-b border-border-custom/40 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Palette size={11} className="text-action" />
                  <span>Colorway Palette</span>
                </span>
                <span className="text-action">{isDark ? 'DARK' : 'LIGHT'}</span>
              </div>

              <div className="space-y-1">
                {COLORWAYS.map((item) => {
                  const active = colorway === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setColorway(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all border ${
                        active
                          ? 'bg-action/10 border-action text-foreground'
                          : 'bg-background/40 border-transparent hover:border-border-custom text-accent hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center -space-x-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/25"
                            style={{ backgroundColor: item.bgHex }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/40"
                            style={{ backgroundColor: item.accentHex }}
                          />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                            {item.name}
                          </div>
                          <div className="text-[8px] text-accent line-clamp-1">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      {active && <Check size={12} className="text-action shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Cursor Style */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-accent border-b border-border-custom/40 pb-1">
                <MousePointer size={11} className="text-action" />
                <span>Cursor Mode</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['minimal', 'bracket', 'dual'] as CursorMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSelectCursor(mode)}
                    className={`py-1.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all ${
                      cursorMode === mode
                        ? 'bg-action text-background border-action'
                        : 'bg-background/50 text-accent border-border-custom/40 hover:text-foreground'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Haptic & Soft Audio Family */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-accent border-b border-border-custom/40 pb-1">
                <span className="flex items-center gap-1.5">
                  <Volume2 size={11} className="text-action" />
                  <span>Haptic Audio Family</span>
                </span>
                <span className="text-[8px] text-action">
                  {audioEnabled ? audioProfile.toUpperCase() : 'MUTED'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {(['haptic', 'soft', 'taptic', 'whisper', 'off'] as const).map((prof) => {
                  const isSelected =
                    prof === 'off' ? !audioEnabled : audioEnabled && audioProfile === prof;
                  return (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => handleSelectAudio(prof)}
                      className={`py-1.5 px-1 rounded-lg text-[8px] font-bold uppercase tracking-wider border transition-all ${
                        isSelected
                          ? 'bg-action text-background border-action'
                          : 'bg-background/50 text-accent border-border-custom/40 hover:text-foreground'
                      }`}
                    >
                      {prof}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
