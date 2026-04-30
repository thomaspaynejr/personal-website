import { createClient } from '@/lib/supabase/server';
import { updateProfile } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const supabase = await createClient();
  const userResponse = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = userResponse.data.user;

  if (!user) {
    redirect('/login');
  }

  const username = user.user_metadata?.username || '';
  const email = user.email || '';

  return (
    <main className="max-w-md mx-auto px-6 py-20 flex flex-col justify-center min-h-[80vh]">
      <div className="space-y-6 bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-widest uppercase text-foreground">User Profile</h1>
          <p className="text-[10px] text-accent font-bold tracking-[0.2em] uppercase opacity-70">Manage your account settings</p>
        </div>

        <form action={updateProfile} className="space-y-5">
          <div className="space-y-3">
            <div>
              <label htmlFor="username" className="block text-[10px] font-bold text-accent uppercase mb-1.5 tracking-widest">Username</label>
              <div className="relative">
                <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={username}
                  className="w-full bg-card/50 border border-border-custom rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-action transition-all text-foreground"
                  placeholder="USERNAME"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-accent uppercase mb-1.5 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={email}
                  className="w-full bg-card/50 border border-border-custom rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-action transition-all text-foreground"
                  placeholder="EMAIL_ADDRESS"
                />
              </div>
              <p className="text-[8px] text-accent mt-1 uppercase tracking-tighter italic opacity-60">* Changing email requires confirmation</p>
            </div>

            <div>
              <label htmlFor="password" title="Leave blank to keep current password" className="block text-[10px] font-bold text-accent uppercase mb-1.5 tracking-widest">New Password</label>
              <div className="relative">
                <Lock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full bg-card/50 border border-border-custom rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-action transition-all text-foreground"
                  placeholder="LEAVE BLANK TO KEEP CURRENT"
                />
              </div>
            </div>
          </div>

          {searchParams.error && (
            <div className="flex items-center gap-2 text-[9px] text-red-500 font-bold uppercase tracking-widest bg-red-500/10 p-2 rounded border border-red-500/20">
              <AlertCircle size={10} />
              <span>Error: {searchParams.error}</span>
            </div>
          )}

          {searchParams.success && (
            <div className="flex items-center gap-2 text-[9px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 p-2 rounded border border-green-500/20">
              <CheckCircle size={10} />
              <span>{searchParams.success}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full py-3 bg-action text-background rounded-lg font-bold hover:opacity-90 transition-all text-[10px] tracking-widest uppercase border-2 border-action"
            >
              Update Profile _
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
