import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { updateTimelineEvent, setUserBlockStatus, deleteTimelineEvent } from '@/app/actions/admin';
import { Shield, Edit, Trash2, UserMinus, UserCheck, AlertTriangle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface UserProfile {
  id: string;
  username: string | null;
  is_blocked: boolean;
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const userResponse = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = userResponse.data.user;

  if (user?.user_metadata?.role !== 'admin') {
    redirect('/');
  }

  // Fetch data for the dashboard
  const { data: events } = await supabase!.from('timeline_events').select('*').order('date', { ascending: false });
  const { data: profiles } = await supabase!.from('profiles').select('*').order('username', { ascending: true });

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <header className="flex items-center gap-4 bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm">
        <div className="p-3 bg-action/10 rounded-xl">
          <Shield size={24} className="text-action" />
        </div>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Admin Control Center</h1>
          <p className="text-[10px] text-accent font-bold tracking-[0.2em] uppercase opacity-70">System Overrides & User Management</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timeline Management */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Edit size={14} className="text-action" />
            <h2 className="text-xs font-bold uppercase tracking-widest">Manage Timeline Events</h2>
          </div>
          
          <div className="space-y-4">
            {(events as TimelineEvent[] | null)?.map((event) => (
              <form key={event.id} action={async (formData) => {
                'use server';
                await updateTimelineEvent(formData);
              }} className="bg-card/40 backdrop-blur-md p-5 rounded-2xl border border-border-custom/30 space-y-4 transition-all hover:border-action/30">
                <input type="hidden" name="id" value={event.id} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Title</label>
                    <input name="title" defaultValue={event.title} className="w-full bg-background border border-border-custom rounded-lg px-3 py-1.5 text-xs outline-none focus:border-action" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Date</label>
                    <input name="date" defaultValue={event.date} className="w-full bg-background border border-border-custom rounded-lg px-3 py-1.5 text-xs outline-none focus:border-action" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Description</label>
                  <textarea name="description" defaultValue={event.description} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action min-h-[80px] resize-none" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button type="button" onClick={() => deleteTimelineEvent(event.id)} className="flex items-center gap-1.5 text-[9px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors">
                    <Trash2 size={10} />
                    Delete Event
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-action text-background rounded-lg text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all border-2 border-action">
                    Save Changes _
                  </button>
                </div>
              </form>
            ))}
            {!events?.length && <p className="text-xs text-accent italic p-8 text-center bg-card/20 rounded-2xl border border-dashed border-border-custom">No events found in database.</p>}
          </div>
        </section>

        {/* User Management */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <AlertTriangle size={14} className="text-action" />
            <h2 className="text-xs font-bold uppercase tracking-widest">User Access Control</h2>
          </div>

          <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border-custom/30 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-custom/30 bg-action/5">
                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent">Username</th>
                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent text-center">Status</th>
                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/20">
                {(profiles as UserProfile[] | null)?.map((profile) => (
                  <tr key={profile.id} className="hover:bg-action/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-foreground">{profile.username || 'Anonymous'}</div>
                      <div className="text-[8px] text-accent font-mono uppercase opacity-50">{profile.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${profile.is_blocked ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                        {profile.is_blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={async () => {
                        'use server';
                        await setUserBlockStatus(profile.id, !profile.is_blocked);
                      }}>
                        <button className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${profile.is_blocked ? 'text-green-500 hover:text-green-400' : 'text-red-500 hover:text-red-400'}`}>
                          {profile.is_blocked ? (
                            <><UserCheck size={10} /> Restore Access</>
                          ) : (
                            <><UserMinus size={10} /> Block User</>
                          )}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {!profiles?.length && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-xs text-accent italic uppercase">No users indexed in profiles table.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
