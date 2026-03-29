import Link from 'next/link';
import ThemeToggle from './ThemeToggle'; 
import { Home, User, Laptop, Mail, LogOut, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { signout } from '@/app/actions/auth';

export default async function Navbar() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <nav className="flex justify-end items-center py-10 px-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-6 text-accent">
        <Link href="/" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group">
          <Home size={14} className="group-hover:text-action transition-colors" />
          <span>HOME</span>
        </Link>
        <Link href="/about" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group">
          <User size={14} className="group-hover:text-action transition-colors" />
          <span>ABOUT</span>
        </Link>
        <Link href="/portfolio" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group">
          <Laptop size={14} className="group-hover:text-action transition-colors" />
          <span>PORTFOLIO</span>
        </Link>
        <Link href="/contact" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group">
          <Mail size={14} className="group-hover:text-action transition-colors" />
          <span>CONTACT</span>
        </Link>

        {user ? (
          <form action={signout}>
            <button className="flex items-center gap-2 text-xs font-medium hover:text-red-500 transition-all duration-300 hover:-translate-y-0.5 group uppercase tracking-widest">
              <LogOut size={14} className="group-hover:text-red-500 transition-colors" />
              <span>SIGNOUT</span>
            </button>
          </form>
        ) : (
          <Link href="/login" className="flex items-center gap-2 text-xs font-medium hover:text-action transition-all duration-300 hover:-translate-y-0.5 group uppercase tracking-widest">
            <LogIn size={14} className="group-hover:text-action transition-colors" />
            <span>LOGIN</span>
          </Link>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
}