'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User as UserIcon, Laptop, LogOut, LogIn, Activity, Shield, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavbarClientProps {
  user: any;
  isAdmin: boolean;
  signoutAction: () => void;
}

export default function NavbarClient({ user, isAdmin, signoutAction }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on navigation
  const handleLinkClick = () => setIsOpen(false);

  const navLinks = [
    { href: '/', label: 'HOME', icon: <Home size={14} className="group-hover:text-action transition-colors" /> },
    { href: '/dashboard', label: 'DASHBOARD', icon: <Activity size={14} className="group-hover:text-action transition-colors" /> },
    { href: '/about', label: 'ABOUT', icon: <UserIcon size={14} className="group-hover:text-action transition-colors" /> },
    { href: '/portfolio', label: 'PORTFOLIO', icon: <Laptop size={14} className="group-hover:text-action transition-colors" /> },
  ];

  if (user) {
    navLinks.push({ href: '/profile', label: 'PROFILE', icon: <UserIcon size={14} className="group-hover:text-action transition-colors" /> });
  }

  if (isAdmin) {
    navLinks.push({ href: '/admin', label: 'ADMIN', icon: <Shield size={14} className="group-hover:text-action transition-colors" /> });
  }

  return (
    <nav className="flex justify-start md:justify-end items-center py-6 md:py-10 px-6 max-w-4xl mx-auto w-full relative z-50">

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 text-accent">
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group shrink-0 ${pathname === link.href ? 'text-foreground' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}

        {user ? (
          <form action={signoutAction} className="shrink-0">
            <button className="flex items-center gap-2 text-xs font-medium hover:text-red-500 transition-all duration-300 hover:-translate-y-0.5 group uppercase tracking-widest">
              <LogOut size={14} className="group-hover:text-red-500 transition-colors" />
              <span>SIGNOUT</span>
            </button>
          </form>
        ) : (
          <Link href="/login" className="flex items-center gap-2 text-xs font-medium hover:text-action transition-all duration-300 hover:-translate-y-0.5 group uppercase tracking-widest shrink-0">
            <LogIn size={14} className="group-hover:text-action transition-colors" />
            <span>LOGIN (JOIN)</span>
          </Link>
        )}
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center gap-4">
        <ThemeToggle />
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-foreground p-1 z-[60] relative transition-transform hover:scale-110 cursor-none"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-6 w-48 bg-card/95 backdrop-blur-md border border-border-custom rounded-xl shadow-2xl overflow-hidden flex flex-col p-2 md:hidden z-50"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={handleLinkClick}
                className={`flex items-center gap-3 text-xs font-medium px-4 py-3 rounded-lg hover:bg-action/10 hover:text-foreground transition-all group ${pathname === link.href ? 'text-foreground bg-action/5' : 'text-accent'}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="h-px bg-border-custom/50 my-1 mx-2" />

            {user ? (
              <form action={signoutAction} className="w-full">
                <button 
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 w-full text-left text-xs font-medium text-accent hover:text-red-500 hover:bg-red-500/10 transition-all px-4 py-3 rounded-lg group uppercase tracking-widest"
                >
                  <LogOut size={14} className="group-hover:text-red-500 transition-colors" />
                  <span>SIGNOUT</span>
                </button>
              </form>
            ) : (
              <Link 
                href="/login" 
                onClick={handleLinkClick}
                className="flex items-center gap-3 text-xs font-medium px-4 py-3 rounded-lg hover:bg-action/10 hover:text-action text-accent transition-all group uppercase tracking-widest"
              >
                <LogIn size={14} className="group-hover:text-action transition-colors" />
                <span>LOGIN (JOIN)</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
