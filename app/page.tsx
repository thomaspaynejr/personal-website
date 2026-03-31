import { createClient } from '@/lib/supabase/server';
import TimelineDashboard from './components/TimelineDashboard';
import { Clock, MapPin, Award, Laptop } from 'lucide-react';

// This would eventually come from your Supabase database
const initialTimeline = [
  {
    id: '1',
    date: "2024 - PRESENT",
    title: "DESKTOP SUPPORT & DEV JOURNEY",
    description: "Solving technical challenges daily while mastering Next.js, React, and modern web architecture in Gulfport.",
    icon: <Laptop size={14} />,
    likes: 0,
    lat: 30.3674, // Gulfport, MS
    lng: -89.0928
  },
  {
    id: '2',
    date: "2020",
    title: "COLLEGE GRADUATION // USM",
    description: "Earned my degree from the University of Southern Mississippi, transitioning from military service to a career in technology.",
    icon: <Award size={14} />,
    likes: 0,
    lat: 31.3271, // Hattiesburg, MS
    lng: -89.2903
  },
  {
    id: '3',
    date: "2012 - 2016",
    title: "US ARMY // ENLISTED SERVICE",
    description: "Served 4 years prior to college. Developed discipline and problem-solving skills in high-pressure environments.",
    icon: <Award size={14} />,
    likes: 0,
    lat: 35.1322, // Fort Bragg / Liberty, NC
    lng: -79.0062
  },
  {
    id: '4',
    date: "2012",
    title: "HIGH SCHOOL GRADUATION",
    description: "Completed high school and immediately entered military service, beginning the journey of personal and professional growth.",
    icon: <MapPin size={14} />,
    likes: 0,
    lat: 30.3674, // Gulfport, MS
    lng: -89.0928
  },
  {
    id: '5',
    date: "1994",
    title: "GENESIS // BORN",
    description: "The starting point of the timeline. Born and raised with a curiosity for how things work.",
    icon: <Clock size={14} />,
    likes: 0,
    lat: 32.4610, // Columbus, GA
    lng: -84.9877
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
