import { createClient } from '@/lib/supabase/server';
import ProjectDashboard from './ProjectDashboard';

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  const { data: projects } = await supabase!
    .from('tracker_projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <ProjectDashboard 
      user={user} 
      initialProjects={projects || []}
    />
  );
}
