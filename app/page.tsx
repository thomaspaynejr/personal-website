import { createClient } from '@/lib/supabase/server';
import TimelineDashboard from './components/TimelineDashboard';
import { Clock, MapPin, Award, Laptop, Activity, Heart, Plus } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  clock: <Clock size={14} />,
  map: <MapPin size={14} />,
  award: <Award size={14} />,
  laptop: <Laptop size={14} />,
  activity: <Activity size={14} />,
  heart: <Heart size={14} />,
  plus: <Plus size={14} />
};

export default async function Home() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  // Fetch timeline events
  const { data: events } = await supabase!
    .from('timeline_events')
    .select('*, timeline_likes(count), timeline_comments(count)')
    .order('created_at', { ascending: false });

  // Map icons and likes/comments
  const timeline = events?.map((event: any) => ({
    ...event,
    icon: iconMap[event.icon_type] || <Clock size={14} />,
    likes: event.timeline_likes?.[0]?.count || 0,
    commentsCount: event.timeline_comments?.[0]?.count || 0
  })) || [];

  return (
    <TimelineDashboard 
      user={user} 
      initialTimeline={timeline}
      initialComments={{}}
    />
  );
}
