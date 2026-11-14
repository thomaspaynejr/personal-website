'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, CornerDownLeft, CheckCircle, Zap, Bot, Volume2, VolumeX, Palette } from 'lucide-react';
import { useTheme, ColorPalette } from '@/app/providers';
import { sendContactMessage } from '@/app/actions/engagement';

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const COMMANDS = [
  'help',
  'ask',
  'audio',
  'cursor',
  'palette',
  'bio',
  'writing',
  'projects',
  'skills',
  'contact',
  'message',
  'send',
  'matrix',
  'lightning',
  'bench',
  'ping',
  'goto',
  'nav',
  'theme',
  'whoami',
  'status',
  'date',
  'clear',
  'admin',
  'exit'
];

let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!sharedAudioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        sharedAudioCtx = new AudioCtx();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export type AudioProfile = 'haptic' | 'soft' | 'taptic' | 'whisper' | 'thock' | 'click';

const VALID_AUDIO_PROFILES: AudioProfile[] = ['haptic', 'soft', 'taptic', 'whisper', 'thock', 'click'];

function triggerHapticPulse(
  ctx: AudioContext,
  startTime: number,
  startFreq: number,
  endFreq: number,
  durationSec: number,
  peakGain: number
) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, startTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + durationSec);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(startFreq * 1.8, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.0012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + durationSec + 0.001);
}

function playMechanicalClick(
  variant: 'keystroke' | 'toggle_on' | 'toggle_off' = 'keystroke',
  profile: AudioProfile = 'haptic'
) {
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (variant === 'toggle_on') {
      // Subtle Apple Taptic double-tap actuator confirmation (zero tonal beep)
      triggerHapticPulse(ctx, now, 115, 48, 0.008, 0.045);
      triggerHapticPulse(ctx, now + 0.038, 155, 62, 0.009, 0.055);
      return;
    }

    if (variant === 'toggle_off') {
      // Soft descending Taptic micro-release tap
      triggerHapticPulse(ctx, now, 140, 55, 0.008, 0.04);
      triggerHapticPulse(ctx, now + 0.036, 95, 40, 0.008, 0.03);
      return;
    }

    // Keystroke Haptic & Soft Sound Family
    if (profile === 'haptic') {
      // Apple Magic Trackpad Taptic micro-tap (tight low-frequency physical surface impulse)
      triggerHapticPulse(ctx, now, 145, 50, 0.0075, 0.045);
    } else if (profile === 'soft') {
      // Whisper-quiet cushioned membrane micro-pop
      triggerHapticPulse(ctx, now, 168, 62, 0.009, 0.032);
    } else if (profile === 'taptic') {
      // Crisp iOS picker wheel / Linear UI sub-millisecond micro-tick
      triggerHapticPulse(ctx, now, 195, 68, 0.006, 0.04);
    } else if (profile === 'whisper') {
      // Ultra-muted sub-surface air tap
      triggerHapticPulse(ctx, now, 120, 44, 0.0085, 0.022);
    } else if (profile === 'thock') {
      // Deep dampened mechanical switch
      triggerHapticPulse(ctx, now, 210, 65, 0.013, 0.048);
    } else {
      // 'click' - Tactile micro-snap
      triggerHapticPulse(ctx, now, 280, 85, 0.009, 0.038);
    }
  } catch {
    // AudioContext blocked or unsupported
  }
}

const DEFAULT_WELCOME_ITEM: HistoryItem = {
  id: 'init-0',
  command: 'sys.init',
  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
  output: (
    <div className="space-y-2 text-accent">
      <div className="text-action font-bold tracking-widest uppercase">
        THOMAS PAYNE // INTERACTIVE CLI HUD v1.2.0
      </div>
      <p className="text-[10px] leading-relaxed">
        Welcome to the command line interface. Type <span className="text-foreground font-bold">&apos;help&apos;</span> to see commands, <span className="text-foreground font-bold">&apos;palette [obsidian|titanium|monokai|carbon]&apos;</span> to switch colorways, or <span className="text-foreground font-bold">&apos;ask &lt;query&gt;&apos;</span> to query the AI assistant.
      </p>
    </div>
  )
};

export default function TerminalHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([DEFAULT_WELCOME_ITEM]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioProfile, setAudioProfile] = useState<AudioProfile>('haptic');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, palette, setPalette } = useTheme();

  // Initialize audio preference safely without React 19 setState-in-effect warning
  useEffect(() => {
    const saved = localStorage.getItem('fx_terminal_audio');
    if (saved === 'true') {
      setTimeout(() => setAudioEnabled(true), 0);
    }
    const savedProfile = localStorage.getItem('fx_terminal_audio_profile') as AudioProfile;
    if (savedProfile && VALID_AUDIO_PROFILES.includes(savedProfile)) {
      setTimeout(() => setAudioProfile(savedProfile), 0);
    }
    const handleAudioSync = (e: Event) => {
      const detail = (e as CustomEvent<{ enabled: boolean; profile: AudioProfile }>).detail;
      if (detail) {
        setAudioEnabled(detail.enabled);
        setAudioProfile(detail.profile);
        if (detail.enabled) {
          playMechanicalClick('keystroke', detail.profile);
        } else {
          playMechanicalClick('toggle_off', detail.profile);
        }
      }
    };
    window.addEventListener('audio_profile_change', handleAudioSync);
    return () => window.removeEventListener('audio_profile_change', handleAudioSync);
  }, []);

  const toggleAudio = (explicit?: boolean) => {
    const nextState = explicit !== undefined ? explicit : !audioEnabled;
    setAudioEnabled(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fx_terminal_audio', nextState ? 'true' : 'false');
    }
    playMechanicalClick(nextState ? 'toggle_on' : 'toggle_off', audioProfile);
  };

  const cyclePalette = () => {
    const order: ColorPalette[] = ['obsidian', 'titanium', 'monokai', 'carbon', 'yeezy'];
    const next = order[(order.indexOf(palette) + 1) % order.length];
    setPalette(next);
    if (audioEnabled) playMechanicalClick('keystroke', audioProfile);
  };

  // Listen for Cmd+K, Ctrl+K, or Backtick
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === '`' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll screen to bottom when history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Save to command history for up/down navigation
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    let outputNode: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
      case '?':
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-action font-bold uppercase tracking-widest">AVAILABLE COMMANDS:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-[10px]">
              <div><span className="text-foreground font-bold w-28 inline-block">help</span> <span className="text-accent">- List all available commands</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">ask &lt;query&gt;</span> <span className="text-accent">- Query AI agent on background & stack</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">palette [name]</span> <span className="text-accent">- Colorway [obsidian|titanium|monokai|carbon]</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">audio [mode]</span> <span className="text-accent">- Haptic audio [haptic|soft|taptic|whisper]</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">cursor [style]</span> <span className="text-accent">- Cursor [minimal|bracket|dual]</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">bio</span> <span className="text-accent">- View background & discipline</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">writing</span> <span className="text-accent">- View articles & essays</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">projects</span> <span className="text-accent">- View active portfolio projects</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">skills</span> <span className="text-accent">- Display full technical stack</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">contact</span> <span className="text-accent">- View contact info</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">message &lt;msg&gt;</span> <span className="text-accent">- Direct transmit to admin inbox</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">matrix [on|off]</span> <span className="text-accent">- Toggle Matrix Rain FX</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">lightning [on|off]</span> <span className="text-accent">- Toggle LightStrike FX</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">bench</span> <span className="text-accent">- System telemetry & diagnostics</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">goto &lt;route&gt;</span> <span className="text-accent">- Jump to page route</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">theme</span> <span className="text-accent">- Toggle theme [dark|light]</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">whoami</span> <span className="text-accent">- Display visitor role</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">status</span> <span className="text-accent">- View system health & runtime</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">date</span> <span className="text-accent">- Current timestamp</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">admin</span> <span className="text-accent">- Direct to Admin control center</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">clear</span> <span className="text-accent">- Clear terminal screen</span></div>
              <div><span className="text-foreground font-bold w-28 inline-block">exit</span> <span className="text-accent">- Close terminal overlay</span></div>
            </div>
          </div>
        );
        break;

      case 'ask':
      case 'ai':
      case 'agent': {
        const query = args.join(' ').trim();
        if (!query) {
          outputNode = (
            <div className="text-[10px] text-amber-400">
              Usage: <span className="font-bold text-foreground">ask &lt;query&gt;</span> (e.g. &apos;ask military background&apos;, &apos;ask tech stack&apos;, &apos;ask projects&apos;)
            </div>
          );
        } else {
          outputNode = (
            <div className="space-y-1.5 text-[10px] text-accent">
              <div className="flex items-center gap-1.5 text-action font-bold">
                <Bot size={12} className="animate-spin" />
                <span>AI ASSISTANT // QUERYING KNOWLEDGE MATRIX...</span>
              </div>
              <p className="text-[9px] text-accent/70">&quot;{query}&quot;</p>
            </div>
          );

          // Fetch async from /api/assistant
          fetch('/api/assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          })
            .then((res) => res.json())
            .then((data) => {
              const aiResponseNode = (
                <div className="space-y-2 text-[10px] bg-card/60 p-3 rounded-xl border border-action/40">
                  <div className="flex items-center justify-between border-b border-border-custom/40 pb-1.5">
                    <div className="flex items-center gap-1.5 text-action font-bold uppercase tracking-wider">
                      <Bot size={12} />
                      <span>{data.topic || 'AI ASSISTANT INTELLIGENCE'}</span>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-action/10 text-action border border-action/20">AGENTIC AI</span>
                  </div>
                  <div className="text-foreground leading-relaxed whitespace-pre-line text-[10px] font-sans font-medium">
                    {data.answer}
                  </div>
                </div>
              );

              setHistory((prev) => [
                ...prev,
                {
                  id: Math.random().toString(36).substring(2),
                  command: 'agent.reply',
                  output: aiResponseNode,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
                }
              ]);
            })
            .catch(() => {
              setHistory((prev) => [
                ...prev,
                {
                  id: Math.random().toString(36).substring(2),
                  command: 'agent.error',
                  output: (
                    <div className="text-[10px] text-red-400">
                      [AI ASSISTANT] Network or server error. Please retry your query.
                    </div>
                  ),
                  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
                }
              ]);
            });
        }
        break;
      }

      case 'palette':
      case 'colorway': {
        const subCmd = args[0]?.toLowerCase() as ColorPalette;
        if (subCmd && ['obsidian', 'titanium', 'monokai', 'carbon', 'yeezy'].includes(subCmd)) {
          setPalette(subCmd);
          outputNode = (
            <div className="text-[10px] text-action flex items-center gap-1.5">
              <Palette size={12} />
              Colorway switched to <span className="font-bold text-foreground uppercase">[{subCmd}]</span>.
            </div>
          );
        } else {
          outputNode = (
            <div className="text-[10px] text-accent space-y-1">
              <div>Active Colorway: <span className="text-action font-bold uppercase">[{palette}]</span></div>
              <div>Usage: <span className="text-foreground font-bold font-mono">palette [obsidian|titanium|monokai|carbon|yeezy]</span></div>
              <div className="text-[9px] text-accent/80">• <span className="text-action">obsidian</span>: Pure #000000 &amp; stark white contrast (default)</div>
              <div className="text-[9px] text-accent/80">• <span className="text-action">titanium</span>: Deep Navy/Slate (`#0B0E14`) with Ice-Blue (`#79C0FF`) accents</div>
              <div className="text-[9px] text-accent/80">• <span className="text-action">monokai</span>: Deep Charcoal (`#121114`) with Electric Emerald (`#A9DC76`) accents</div>
              <div className="text-[9px] text-accent/80">• <span className="text-action">carbon</span>: Stealth Matte Carbon (`#0C0C0C`) with Bone-White (`#E6E6E6`) type</div>
              <div className="text-[9px] text-accent/80">• <span className="text-action">yeezy</span>: Warm Stone Graphite (`#141312`) with Earth (`#D8D0C5`) tokens</div>
            </div>
          );
        }
        break;
      }

      case 'audio':
      case 'sound': {
        const subCmd = args[0]?.toLowerCase();
        let targetState: boolean;
        if (subCmd === 'on') {
          targetState = true;
        } else if (subCmd === 'off') {
          targetState = false;
        } else if (subCmd && VALID_AUDIO_PROFILES.includes(subCmd as AudioProfile)) {
          const profile = subCmd as AudioProfile;
          setAudioProfile(profile);
          if (typeof window !== 'undefined') {
            localStorage.setItem('fx_terminal_audio_profile', profile);
          }
          if (!audioEnabled) toggleAudio(true);
          playMechanicalClick('keystroke', profile);
          outputNode = (
            <div className="text-[10px] text-action flex items-center gap-1.5">
              <Volume2 size={12} />
              Audio profile switched to <span className="font-bold text-foreground uppercase">[{profile}]</span> (Haptic &amp; Soft Acoustic Engine).
            </div>
          );
          break;
        } else {
          targetState = !audioEnabled;
        }

        toggleAudio(targetState);

        outputNode = (
          <div className="text-[10px] text-action space-y-1">
            <div className="flex items-center gap-1.5">
              {targetState ? <Volume2 size={12} /> : <VolumeX size={12} />}
              Keystroke audio turned <span className="font-bold text-foreground">{targetState ? 'ON [ENABLED]' : 'OFF [MUTED]'}</span>. Profile: <span className="font-bold text-foreground uppercase">[{audioProfile}]</span>.
            </div>
            <div className="text-[9px] text-accent">
              Profiles: <span className="text-foreground">audio haptic</span> (Apple trackpad), <span className="text-foreground">audio soft</span> (cushioned pop), <span className="text-foreground">audio taptic</span> (crisp micro-tick), <span className="text-foreground">audio whisper</span> (muted air tap)
            </div>
          </div>
        );
        break;
      }

      case 'cursor': {
        const subCmd = args[0]?.toLowerCase();
        if (subCmd === 'dual' || subCmd === 'minimal' || subCmd === 'bracket') {
          if (typeof window !== 'undefined') {
            localStorage.setItem('fx_cursor_mode', subCmd);
            window.dispatchEvent(new CustomEvent('cursor_mode_change', { detail: subCmd }));
          }
          outputNode = (
            <div className="text-[10px] text-action">
              Cursor style switched to <span className="font-bold text-foreground uppercase">[{subCmd}]</span>.
            </div>
          );
        } else {
          outputNode = (
            <div className="text-[10px] text-accent space-y-1">
              <div>Usage: <span className="text-foreground font-bold font-mono">cursor [minimal|bracket|dual]</span></div>
              <div className="text-[9px] text-accent/80">• <span className="text-action">minimal</span>: Illuminated light core inside a crisp bold contrasting outline</div>
              <div className="text-[9px] text-accent/80">• <span className="text-action">bracket</span>: Tactical HUD reticle with emerald/cyan target lock rotation</div>
              <div className="text-[9px] text-accent/80">• <span className="text-action">dual</span>: Pinpoint center dot with fluid spring trailing halo</div>
            </div>
          );
        }
        break;
      }

      case 'bio':
        outputNode = (
          <div className="space-y-2 text-xs text-accent">
            <div className="text-action font-bold uppercase tracking-widest">THOMAS PAYNE // BIO</div>
            <p className="text-[10px] leading-relaxed">
              Software Engineer &amp; Former Military Service Member. Built on a foundation of discipline, service, and continuous learning. Specializing in high-performance web applications with Next.js, TypeScript, React, and Supabase.
            </p>
          </div>
        );
        break;

      case 'writing':
      case 'articles':
        outputNode = (
          <div className="space-y-2 text-xs text-accent">
            <div className="text-action font-bold uppercase tracking-widest">WRITING &amp; ARTICLES:</div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center border-b border-border-custom/30 pb-1">
                <span className="text-foreground font-bold">Latest Technical Essays &amp; Notes</span>
                <Link href="/writing" onClick={() => setIsOpen(false)} className="text-action hover:underline">View All Essays &rarr;</Link>
              </div>
              <p className="text-accent text-[9px]">Explore write-ups on software architecture, discipline, military transition, and Next.js 16.</p>
            </div>
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-action font-bold uppercase tracking-widest">FEATURED PROJECTS:</div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center border-b border-border-custom/30 pb-1">
                <span className="text-foreground font-bold">1. Personal Website &amp; Platform</span>
                <Link href="/portfolio" onClick={() => setIsOpen(false)} className="text-action hover:underline">View Portfolio &rarr;</Link>
              </div>
              <p className="text-accent text-[9px]">Monochromatic Yeezy-inspired portfolio &amp; admin hub with Next.js 16, Supabase SSR, and Framer Motion.</p>
              <div className="flex justify-between items-center border-b border-border-custom/30 pb-1 pt-2">
                <span className="text-foreground font-bold">2. Journey Activity Tracker</span>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-action hover:underline">View Tracker &rarr;</Link>
              </div>
              <p className="text-accent text-[9px]">Real-time engagement timeline and project tracking dashboard.</p>
            </div>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-action font-bold uppercase tracking-widest font-mono">TECHNICAL TOOLKIT:</div>
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div className="bg-card/40 p-2.5 rounded-lg border border-border-custom/30">
                <div className="text-foreground font-bold mb-1">Frontend</div>
                <div className="text-accent text-[9px]">Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion</div>
              </div>
              <div className="bg-card/40 p-2.5 rounded-lg border border-border-custom/30">
                <div className="text-foreground font-bold mb-1">Backend &amp; DB</div>
                <div className="text-accent text-[9px]">Node.js, Supabase, PostgreSQL, Server Actions, REST APIs</div>
              </div>
              <div className="bg-card/40 p-2.5 rounded-lg border border-border-custom/30">
                <div className="text-foreground font-bold mb-1">DevOps &amp; Tooling</div>
                <div className="text-accent text-[9px]">Git, Vercel, Turbopack, ESLint, Antigravity CLI</div>
              </div>
              <div className="bg-card/40 p-2.5 rounded-lg border border-border-custom/30">
                <div className="text-foreground font-bold mb-1">Methodology</div>
                <div className="text-accent text-[9px]">High-contrast Yeezy Minimalism, Agile, Monochromatic Design</div>
              </div>
            </div>
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-action font-bold uppercase tracking-widest">CONTACT DETAILS:</div>
            <div className="space-y-1 text-[10px] text-accent">
              <div><span className="text-foreground font-bold w-20 inline-block">Form:</span> <Link href="/contact" onClick={() => setIsOpen(false)} className="text-action hover:underline">/contact</Link></div>
              <div><span className="text-foreground font-bold w-20 inline-block">CLI Transmit:</span> Type &apos;<span className="text-foreground font-bold">message &lt;text&gt;</span>&apos; right here</div>
              <div><span className="text-foreground font-bold w-20 inline-block">GitHub:</span> github.com/thomaspaynejr</div>
              <div><span className="text-foreground font-bold w-20 inline-block">LinkedIn:</span> linkedin.com</div>
            </div>
          </div>
        );
        break;

      case 'matrix': {
        const currentSaved = typeof window !== 'undefined' ? localStorage.getItem('fx_matrix') !== 'false' : true;
        const targetState = args[0] === 'off' ? false : args[0] === 'on' ? true : !currentSaved;
        if (typeof window !== 'undefined') {
          localStorage.setItem('fx_matrix', targetState ? 'true' : 'false');
          window.dispatchEvent(new CustomEvent('fx-toggle', { detail: { type: 'matrix', enabled: targetState } }));
        }
        outputNode = (
          <div className="text-[10px] text-action">
            Matrix Rain FX turned <span className="font-bold text-foreground">{targetState ? 'ON [ENABLED]' : 'OFF [DISABLED]'}</span>.
          </div>
        );
        break;
      }

      case 'lightning': {
        const currentSaved = typeof window !== 'undefined' ? localStorage.getItem('fx_lightning') !== 'false' : true;
        const targetState = args[0] === 'off' ? false : args[0] === 'on' ? true : !currentSaved;
        if (typeof window !== 'undefined') {
          localStorage.setItem('fx_lightning', targetState ? 'true' : 'false');
          window.dispatchEvent(new CustomEvent('fx-toggle', { detail: { type: 'lightning', enabled: targetState } }));
        }
        outputNode = (
          <div className="text-[10px] text-action">
            LightStrike FX turned <span className="font-bold text-foreground">{targetState ? 'ON [ENABLED]' : 'OFF [DISABLED]'}</span>.
          </div>
        );
        break;
      }

      case 'message':
      case 'send': {
        const messageBody = args.join(' ');
        if (!messageBody.trim()) {
          outputNode = (
            <div className="text-[10px] text-amber-400">
              Usage: <span className="font-bold text-foreground">message &lt;your message text&gt;</span> (e.g. &apos;message Hello Thomas!&apos;)
            </div>
          );
        } else {
          outputNode = (
            <div className="text-[10px] text-action">
              [CLI] Transmitting message to admin inbox...
            </div>
          );
          const fd = new FormData();
          fd.append('name', 'CLI Terminal Visitor');
          fd.append('email', 'cli-visitor@personal-website.local');
          fd.append('message', messageBody);
          sendContactMessage(fd).then((res) => {
            const resultNode = res.success ? (
              <div className="text-[10px] text-green-400 font-bold">
                [CLI] Message transmitted successfully to admin inbox! _
              </div>
            ) : (
              <div className="text-[10px] text-red-400 font-bold">
                [CLI] Transmission failed: {res.error}
              </div>
            );
            setHistory((prev) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(2),
                command: 'sys.msg_confirm',
                output: resultNode,
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
              }
            ]);
          });
        }
        break;
      }

      case 'bench':
      case 'ping': {
        const domCount = typeof document !== 'undefined' ? document.querySelectorAll('*').length : 0;
        const resWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        const resHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
        const navConn = (typeof navigator !== 'undefined' && (navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType) || '4g';
        const perfMemory = typeof performance !== 'undefined' ? (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory : null;
        const usedMB = perfMemory?.usedJSHeapSize ? Math.round(perfMemory.usedJSHeapSize / (1024 * 1024)) : null;

        outputNode = (
          <div className="space-y-1 text-[10px] font-mono">
            <div className="text-action font-bold uppercase tracking-widest flex items-center gap-1">
              <Zap size={10} />
              SYSTEM BENCHMARK &amp; TELEMETRY:
            </div>
            <div className="grid grid-cols-2 gap-2 text-accent bg-card/40 p-2.5 rounded-lg border border-border-custom/30">
              <div><span className="text-foreground font-bold">DOM Nodes:</span> {domCount}</div>
              <div><span className="text-foreground font-bold">Viewport:</span> {resWidth}x{resHeight}</div>
              <div><span className="text-foreground font-bold">Network Type:</span> {navConn.toUpperCase()}</div>
              <div><span className="text-foreground font-bold">JS Heap:</span> {usedMB ? `${usedMB} MB` : 'Optimal'}</div>
              <div><span className="text-foreground font-bold">Theme / Palette:</span> {(theme || 'dark').toUpperCase()} {'//'} {palette.toUpperCase()}</div>
              <div><span className="text-foreground font-bold">Engine:</span> Turbopack</div>
            </div>
          </div>
        );
        break;
      }

      case 'goto':
      case 'nav': {
        const target = args[0] ? args[0].toLowerCase().replace(/^\//, '') : '';
        const validRoutes: Record<string, string> = {
          '': '/',
          'home': '/',
          'about': '/about',
          'writing': '/writing',
          'articles': '/writing',
          'portfolio': '/portfolio',
          'dashboard': '/dashboard',
          'tracker': '/dashboard',
          'contact': '/contact',
          'admin': '/admin'
        };

        if (target in validRoutes) {
          const dest = validRoutes[target];
          outputNode = <div className="text-action text-[10px]">Navigating to {dest}...</div>;
          setTimeout(() => {
            window.location.href = dest;
          }, 300);
        } else {
          outputNode = (
            <div className="text-[10px] text-red-400">
              Invalid route: &apos;{target}&apos;. Available: home, about, writing, portfolio, dashboard, contact, admin.
            </div>
          );
        }
        break;
      }

      case 'theme': {
        const arg = args[0]?.toLowerCase();
        if (arg === 'light') {
          setTheme('light');
          outputNode = <div className="text-action text-[10px]">Theme set to LIGHT mode.</div>;
        } else if (arg === 'dark') {
          setTheme('dark');
          outputNode = <div className="text-action text-[10px]">Theme set to DARK mode.</div>;
        } else if (arg && ['obsidian', 'titanium', 'monokai', 'carbon', 'yeezy'].includes(arg)) {
          setPalette(arg as ColorPalette);
          outputNode = <div className="text-action text-[10px]">Colorway set to <span className="font-bold uppercase text-foreground">[{arg}]</span>.</div>;
        } else {
          const nextTheme = theme === 'dark' ? 'light' : 'dark';
          setTheme(nextTheme);
          outputNode = <div className="text-action text-[10px]">Theme toggled to {nextTheme.toUpperCase()} mode.</div>;
        }
        break;
      }

      case 'whoami':
        outputNode = (
          <div className="text-[10px] text-accent">
            Role: <span className="text-action font-bold uppercase">GUEST_VISITOR</span> | Session: <span className="text-foreground">AUTHENTICATED_SSR</span> | Access Level: <span className="text-foreground">READ_ENGAGE</span>
          </div>
        );
        break;

      case 'status':
      case 'sys':
        outputNode = (
          <div className="space-y-1.5 text-[10px]">
            <div className="text-action font-bold uppercase tracking-widest">SYSTEM DIAGNOSTICS:</div>
            <div className="grid grid-cols-2 gap-2 text-accent">
              <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-green-500" /> Runtime: Next.js 16.2.1</div>
              <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-green-500" /> Database: Supabase Postgres</div>
              <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-green-500" /> Styling: Tailwind CSS 4</div>
              <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-green-500" /> Engine: Turbopack</div>
            </div>
          </div>
        );
        break;

      case 'date':
        outputNode = <div className="text-[10px] text-foreground font-mono">{new Date().toString()}</div>;
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'admin':
      case 'sudo':
        window.location.href = '/admin';
        outputNode = <div className="text-action text-[10px]">Redirecting to Admin Control Center...</div>;
        break;

      case 'exit':
      case 'close':
      case 'quit':
        setIsOpen(false);
        setInput('');
        return;

      default:
        outputNode = (
          <div className="text-[10px] text-red-400">
            Command not recognized: &apos;{trimmed}&apos;. Type <span className="text-foreground font-bold">&apos;help&apos;</span> for a list of valid commands.
          </div>
        );
    }

    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2),
      command: trimmed,
      output: outputNode,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    setHistory((prev) => [...prev, newItem]);
    setInput('');
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (audioEnabled) {
      playMechanicalClick('keystroke', audioProfile);
    }
    if (e.key === 'Enter') {
      processCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (!input.trim()) return;
      const matching = COMMANDS.filter((c) => c.startsWith(input.toLowerCase()));
      if (matching.length === 1) {
        setInput(matching[0]);
      }
    }
  };

  return (
    <>
      {/* Floating Action Badge Trigger (Fixed in bottom right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-md border border-border-custom text-[10px] font-bold text-accent hover:text-foreground hover:border-action transition-all shadow-lg group cursor-none"
        title="Open Developer HUD (Cmd+K)"
      >
        <Terminal size={12} className="text-action group-hover:animate-pulse" />
        <span className="uppercase tracking-widest hidden sm:inline">CLI</span>
        <span className="text-[8px] bg-action/10 text-action px-1.5 py-0.5 rounded border border-action/30 uppercase font-mono">⌘K</span>
      </button>

      {/* Terminal Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl h-[520px] bg-card/95 backdrop-blur-xl border-2 border-action/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono relative"
            >
              {/* Window Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-action/10 border-b border-border-custom/50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-action animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-foreground">
                    THOMAS PAYNE // DEVELOPER HUD v1.2.0
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={cyclePalette}
                    className="px-2 py-0.5 rounded bg-background/60 border border-border-custom hover:border-action text-[8px] font-bold uppercase tracking-widest text-accent hover:text-action transition-colors flex items-center gap-1 cursor-none"
                    title="Cycle Colorway Palette (obsidian / titanium / monokai / carbon)"
                  >
                    <Palette size={10} className="text-action" />
                    <span>{palette}</span>
                  </button>
                  <button
                    onClick={() => toggleAudio()}
                    className="p-1 text-accent hover:text-foreground transition-colors cursor-none flex items-center gap-1"
                    title={audioEnabled ? `Mute Keystroke Audio (${audioProfile})` : 'Enable Keystroke Audio'}
                  >
                    {audioEnabled ? <Volume2 size={13} className="text-action" /> : <VolumeX size={13} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-accent hover:text-foreground transition-colors cursor-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Terminal Screen / History Scroll Area */}
              <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-mono">
                {history.map((item) => (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] text-accent/70">
                      <span className="text-action font-bold">&gt;</span>
                      <span className="text-foreground font-bold">{item.command}</span>
                      <span className="text-[8px] text-accent/40 ml-auto">{item.timestamp}</span>
                    </div>
                    <div className="pl-4">{item.output}</div>
                  </div>
                ))}
              </div>

              {/* Command Input Prompt Bar */}
              <div className="p-3 bg-background/50 border-t border-border-custom/50 flex items-center gap-2 shrink-0">
                <span className="text-action font-bold text-xs">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDownInput}
                  placeholder="Type a command (e.g. 'help', 'palette titanium', 'audio haptic', 'cursor bracket')..."
                  className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-accent/40 font-mono"
                  spellCheck={false}
                  autoComplete="off"
                />
                <button
                  onClick={() => processCommand(input)}
                  className="p-1.5 bg-action/10 hover:bg-action text-action hover:text-background rounded-md transition-all text-xs cursor-none"
                >
                  <CornerDownLeft size={12} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
