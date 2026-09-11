import { createClient } from '@/lib/supabase/server';
import TimelineDashboard, { TimelineEvent } from './components/TimelineDashboard';
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

const DEFAULT_TIMELINE: TimelineEvent[] = [
  {
    id: 'default-1',
    date: 'AUG 2026',
    title: '#BUILD // Next.js 16 Architecture & Web Audio Synthesis',
    description: 'Migrated personal website platform to Next.js 16 Turbopack with real-time HUD terminal, custom Web Audio mechanical keyclick synthesis, and Supabase RLS policies.',
    icon_type: 'laptop',
    icon: <Laptop size={14} />,
    likes: 14,
    commentsCount: 2,
    userHasLiked: false,
    code_snippet: `// Web Audio tactile mechanical switch synthesizer
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const osc = ctx.createOscillator();
const gain = ctx.createGain();

osc.type = 'triangle';
osc.frequency.setValueAtTime(280, ctx.currentTime);
osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.012);

gain.gain.setValueAtTime(0.04, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);

osc.connect(gain);
gain.connect(ctx.destination);
osc.start();
osc.stop(ctx.currentTime + 0.012);`
  },
  {
    id: 'default-2',
    date: 'JUL 2026',
    title: '#MILESTONE // Monochromatic Obsidian Design System v2.0',
    description: 'Architected Yeezy-inspired dark grayscale layout, custom dual-layer spring cursor, and responsive case study readers.',
    icon_type: 'award',
    icon: <Award size={14} />,
    likes: 21,
    commentsCount: 1,
    userHasLiked: true,
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'default-3',
    date: 'JUN 2026',
    title: '#MILITARY // Operational Rigor to Systems Engineering',
    description: 'Translating military service discipline, structured execution, and deterministic fail-safes into high-throughput software architecture.',
    icon_type: 'activity',
    icon: <Activity size={14} />,
    likes: 29,
    commentsCount: 0,
    userHasLiked: false
  },
  {
    id: 'default-4',
    date: 'MAY 2026',
    title: '#LEARNING // Turbopack Benchmarks & Async Server Components',
    description: 'Deep-dive evaluation of Next.js 16 incremental compilation times, root proxy interceptors, and strict React 19 hook lifecycles.',
    icon_type: 'clock',
    icon: <Clock size={14} />,
    likes: 9,
    commentsCount: 0,
    userHasLiked: false
  }
];

const DEFAULT_COMMENTS: Record<string, { id: string; text: string; date: string; username: string }[]> = {
  'default-1': [
    {
      id: 'comm-1',
      text: 'The Web Audio switch synthesis feels incredibly tactile and subtle.',
      date: 'Aug 12',
      username: 'alex_dev'
    },
    {
      id: 'comm-2',
      text: 'Great work on the Turbopack build speed optimization.',
      date: 'Aug 14',
      username: 'sarah_eng'
    }
  ],
  'default-2': [
    {
      id: 'comm-3',
      text: 'The obsidian contrast and typography hierarchy look razor sharp.',
      date: 'Jul 30',
      username: 'marcus_k'
    }
  ]
};

export default async function Home() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  // Fetch timeline events with counts and user specific like status
  let events: unknown[] = [];
  if (supabase) {
    try {
      const { data } = await supabase
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
      if (data && data.length > 0) {
        events = data;
      }
    } catch {
      // Offline fallback
    }
  }

  // Map events and extract comments
  const timelineComments: Record<string, { id: string; text: string; date: string; username: string }[]> = {};
  
  let timeline: TimelineEvent[] = (events as unknown as DBEvent[])?.map((event) => {
    // Store comments for this event
    timelineComments[event.id] = event.timeline_comments?.map((c) => ({
      id: c.id,
      text: c.text,
      date: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      username: c.profiles?.username || 'Anonymous'
    })) || [];

    return {
      id: event.id,
      date: event.date,
      title: event.title,
      description: event.description,
      icon: iconMap[event.icon_type] || <Clock size={14} />,
      likes: event.timeline_likes?.length || 0,
      userHasLiked: event.timeline_likes?.some((l) => l.user_id === user?.id),
      commentsCount: event.timeline_comments?.length || 0,
      code_snippet: (event as unknown as { code_snippet?: string }).code_snippet,
      image_url: (event as unknown as { image_url?: string }).image_url
    };
  }) || [];

  let finalComments = timelineComments;
  if (timeline.length === 0) {
    timeline = DEFAULT_TIMELINE;
    finalComments = DEFAULT_COMMENTS;
  }

  return (
    <TimelineDashboard 
      user={user} 
      initialTimeline={timeline}
      initialComments={finalComments}
    />
  );
}
