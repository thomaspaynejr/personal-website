import Link from 'next/link';
import ThemeToggle from './ThemeToggle'; 
import { Home, User, Laptop, Mail, LogOut, LogIn, Activity, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { signout } from '@/app/actions/auth';

export default async function Navbar() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <nav className="flex justify-end items-center py-6 md:py-10 px-6 max-w-4xl mx-auto w-full relative z-50">
      <div className="flex items-center gap-6 text-accent overflow-x-auto w-full md:w-auto justify-start md:justify-end no-scrollbar pb-2 md:pb-0">
        <Link href="/" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group shrink-0">
          <Home size={14} className="group-hover:text-action transition-colors" />
          <span>HOME</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group shrink-0">
          <Activity size={14} className="group-hover:text-action transition-colors" />
          <span>DASHBOARD</span>
        </Link>
        <Link href="/about" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group shrink-0">
          <User size={14} className="group-hover:text-action transition-colors" />
          <span>ABOUT</span>
        </Link>
        <Link href="/portfolio" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group shrink-0">
          <Laptop size={14} className="group-hover:text-action transition-colors" />
          <span>PORTFOLIO</span>
        </Link>

        {user && (
          <Link href="/profile" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group uppercase tracking-widest shrink-0">
            <User size={14} className="group-hover:text-action transition-colors" />
            <span>PROFILE</span>
          </Link>
        )}

        {user?.user_metadata?.role === 'admin' && (
          <Link href="/admin" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group uppercase tracking-widest shrink-0">
            <Shield size={14} className="group-hover:text-action transition-colors" />
            <span>ADMIN</span>
          </Link>
        )}

        {user ? (
          <form action={signout} className="shrink-0">
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
    </nav>
  );
}