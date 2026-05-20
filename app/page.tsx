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

interface DBEvent {
  id: string;
  created_at: string;
  icon_type: string;
  title: string;
  description: string;
  date: string;
  timeline_likes: { user_id: string }[];
  timeline_comments: {
    id: string;
    text: string;
    created_at: string;
    profiles: { username: string | null } | null;
  }[];
}

export default async function Home() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  // Fetch timeline events with counts and user specific like status
  const { data: events } = await supabase!
    .from('timeline_events')
    .select(`
      *,
      timeline_likes(user_id),
      timeline_comments(
        id,
        text,
        created_at,
        profiles(username)
      )
    `)
    .order('created_at', { ascending: false });

  // Map events and extract comments
  const timelineComments: Record<string, { id: string; text: string; date: string; username: string }[]> = {};
  
  const timeline = (events as unknown as DBEvent[])?.map((event) => {
    // Store comments for this event
    timelineComments[event.id] = event.timeline_comments?.map((c) => ({
      id: c.id,
      text: c.text,
      date: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      username: c.profiles?.username || 'Anonymous'
    })) || [];

    return {
      ...event,
      icon: iconMap[event.icon_type] || <Clock size={14} />,
      likes: event.timeline_likes?.length || 0,
      userHasLiked: event.timeline_likes?.some((l) => l.user_id === user?.id),
      commentsCount: event.timeline_comments?.length || 0
    };
  }) || [];

  return (
    <TimelineDashboard 
      user={user} 
      initialTimeline={timeline}
      initialComments={timelineComments}
    />
  );
}
