import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Shield } from 'lucide-react';
import AdminClient from './AdminClient';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const userResponse = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = userResponse.data.user;

  if (user?.user_metadata?.role !== 'admin') {
    redirect('/');
  }

  // Fetch all data for the dashboard
  const { data: events } = await supabase!.from('timeline_events').select('*').order('created_at', { ascending: false });
  const { data: profiles } = await supabase!.from('profiles').select('*').order('username', { ascending: true });
  const { data: portfolio } = await supabase!.from('portfolio_projects').select('*').order('display_order', { ascending: true });
  const { data: tracker } = await supabase!.from('tracker_projects').select('*').order('created_at', { ascending: false });
  const { data: about } = await supabase!.from('about_content').select('*').eq('id', '00000000-0000-0000-0000-000000000001').single();

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <header className="flex items-center gap-4 bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm">
        <div className="p-3 bg-action/10 rounded-xl">
          <Shield size={24} className="text-action" />
        </div>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Admin Control Center</h1>
          <p className="text-[10px] text-accent font-bold tracking-[0.2em] uppercase opacity-70">System Overrides & Content Management</p>
        </div>
      </header>

      <AdminClient 
        initialEvents={events || []} 
        initialProfiles={profiles || []}
        initialPortfolio={portfolio || []}
        initialTracker={tracker || []}
        initialAbout={about}
      />
    </main>
  );
}
