import { createClient } from '@/lib/supabase/server';
import ProjectDashboard from './ProjectDashboard';

const initialProjects = [
  {
    id: 'p1',
    name: "PERSONAL PORTFOLIO",
    status: 'ACTIVE' as const,
    progress: 95,
    description: "Refining minimalist Yeezy-inspired UI and dashboard features."
  },
  {
    id: 'p2',
    name: "ARMY LOGISTICS TRACKER",
    status: 'RESEARCHING' as const,
    progress: 20,
    description: "Building a high-efficiency inventory tool based on military supply principles."
  },
  {
    id: 'p3',
    name: "TICKET DASHBOARD V2",
    status: 'ACTIVE' as const,
    progress: 45,
    description: "Streamlined support dashboard for desktop troubleshooting teams."
  }
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <ProjectDashboard 
      user={user} 
      initialProjects={initialProjects}
    />
  );
}
