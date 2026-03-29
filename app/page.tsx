import { createClient } from '@/lib/supabase/server';
import TimelineDashboard from './components/TimelineDashboard';
import { Clock, MapPin, Award, Laptop } from 'lucide-react';

// This would eventually come from your Supabase database
const initialTimeline = [
  {
    id: '1',
    date: "2024 - PRESENT",
    title: "DESKTOP SUPPORT & DEV JOURNEY",
    description: "Solving technical challenges daily while mastering Next.js, React, and modern web architecture.",
    icon: <Laptop size={14} />,
    likes: 0
  },
  {
    id: '2',
    date: "2020 - 2024",
    title: "US ARMY // LOGISTICS SPECIALIST",
    description: "4 years of service. Developed discipline, leadership, and complex problem-solving skills in high-pressure environments.",
    icon: <Award size={14} />,
    likes: 0
  },
  {
    id: '3',
    date: "EDUCATION",
    title: "UNIVERSITY OF SOUTHERN MISSISSIPPI",
    description: "Pursued higher education, bridging the gap between military service and a career in technology.",
    icon: <MapPin size={14} />,
    likes: 0
  }
];

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

export default async function Home() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  // In a real app, you would fetch these from Supabase here
  // const projects = supabase ? (await supabase.from('projects').select('*')).data : initialProjects;
  // const timeline = supabase ? (await supabase.from('timeline_events').select('*')).data : initialTimeline;

  return (
    <TimelineDashboard 
      user={user} 
      initialTimeline={initialTimeline}
      initialProjects={initialProjects}
      initialComments={{}}
    />
  );
}
