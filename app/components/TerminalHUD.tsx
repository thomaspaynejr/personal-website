'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, CornerDownLeft, CheckCircle } from 'lucide-react';
import { useTheme } from '@/app/providers';

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const COMMANDS = [
  'help',
  'bio',
  'projects',
  'skills',
  'contact',
  'theme',
  'whoami',
  'status',
  'date',
  'clear',
  'admin',
  'exit'
];

const DEFAULT_WELCOME_ITEM: HistoryItem = {
  id: 'init-0',
  command: 'sys.init',
  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
  output: (
    <div className="space-y-2 text-accent">
      <div className="text-action font-bold tracking-widest uppercase">
        THOMAS PAYNE // INTERACTIVE CLI HUD v1.0.0
      </div>
      <p className="text-[10px] leading-relaxed">
        Welcome to the command line interface. Type <span className="text-foreground font-bold">&apos;help&apos;</span> to see available commands or press <span className="text-foreground font-bold">&apos;Tab&apos;</span> for autocomplete.
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
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

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
              <div><span className="text-foreground font-bold w-20 inline-block">help</span> <span className="text-accent">- List all available commands</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">bio</span> <span className="text-accent">- View background & discipline</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">projects</span> <span className="text-accent">- View active portfolio projects</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">skills</span> <span className="text-accent">- Display full technical stack</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">contact</span> <span className="text-accent">- Get email & social links</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">theme</span> <span className="text-accent">- Toggle theme [dark|light]</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">whoami</span> <span className="text-accent">- Display visitor role</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">status</span> <span className="text-accent">- View system health & runtime</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">date</span> <span className="text-accent">- Current timestamp</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">admin</span> <span className="text-accent">- Direct to Admin control center</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">clear</span> <span className="text-accent">- Clear terminal screen</span></div>
              <div><span className="text-foreground font-bold w-20 inline-block">exit</span> <span className="text-accent">- Close terminal overlay</span></div>
            </div>
          </div>
        );
        break;

      case 'bio':
        outputNode = (
          <div className="space-y-2 text-xs text-accent">
            <div className="text-action font-bold uppercase tracking-widest">THOMAS PAYNE // BIO</div>
            <p className="text-[10px] leading-relaxed">
              Software Engineer & Former Military Service Member. Built on a foundation of discipline, service, and continuous learning. Specializing in high-performance web applications with Next.js, TypeScript, React, and Supabase.
            </p>
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="space-y-2 text-xs">
            <div className="text-action font-bold uppercase tracking-widest">FEATURED PROJECTS:</div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center border-b border-border-custom/30 pb-1">
                <span className="text-foreground font-bold">1. Personal Website & Platform</span>
                <a href="/portfolio" className="text-action hover:underline">View Portfolio &rarr;</a>
              </div>
              <p className="text-accent text-[9px]">Monochromatic Yeezy-inspired portfolio & admin hub with Next.js 16, Supabase SSR, and Framer Motion.</p>
              <div className="flex justify-between items-center border-b border-border-custom/30 pb-1 pt-2">
                <span className="text-foreground font-bold">2. Journey Activity Tracker</span>
                <a href="/dashboard" className="text-action hover:underline">View Tracker &rarr;</a>
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
                <div className="text-foreground font-bold mb-1">Backend & DB</div>
                <div className="text-accent text-[9px]">Node.js, Supabase, PostgreSQL, Server Actions, REST APIs</div>
              </div>
              <div className="bg-card/40 p-2.5 rounded-lg border border-border-custom/30">
                <div className="text-foreground font-bold mb-1">DevOps & Tooling</div>
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
              <div><span className="text-foreground font-bold w-20 inline-block">Form:</span> <a href="/contact" className="text-action hover:underline">/contact</a></div>
              <div><span className="text-foreground font-bold w-20 inline-block">GitHub:</span> github.com/thomaspaynejr</div>
              <div><span className="text-foreground font-bold w-20 inline-block">LinkedIn:</span> linkedin.com</div>
            </div>
          </div>
        );
        break;

      case 'theme':
        if (args[0] === 'light') {
          setTheme('light');
          outputNode = <div className="text-action text-[10px]">Theme set to LIGHT mode.</div>;
        } else if (args[0] === 'dark') {
          setTheme('dark');
          outputNode = <div className="text-action text-[10px]">Theme set to DARK mode.</div>;
        } else {
          const nextTheme = theme === 'dark' ? 'light' : 'dark';
          setTheme(nextTheme);
          outputNode = <div className="text-action text-[10px]">Theme toggled to {nextTheme.toUpperCase()} mode.</div>;
        }
        break;

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
                    THOMAS PAYNE // DEVELOPER HUD v1.0.0
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] text-accent uppercase tracking-widest hidden sm:inline">
                    PRESS ESC OR TYPE EXIT
                  </span>
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
                  placeholder="Type a command (e.g. 'help', 'projects', 'theme')..."
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
