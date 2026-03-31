'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Clock, Heart, MessageSquare, Plus, X, LogIn } from 'lucide-react';
import Link from 'next/link';
import { StaggerContainer, StaggerItem, FadeIn } from './Animations';
import Globe from './Globe';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  likes: number;
  lat?: number;
  lng?: number;
}

const TimelineItem = ({ 
  event, 
  user, 
  onVisible, 
  timelineComments, 
  activeCommentId, 
  setActiveCommentId, 
  handleLikeTimeline, 
  tempComment, 
  setTempComment, 
  handlePostTimelineComment 
}: { 
  event: TimelineEvent; 
  user: any; 
  onVisible: (loc: {lat: number, lng: number} | null) => void;
  timelineComments: any;
  activeCommentId: string | null;
  setActiveCommentId: (id: string | null) => void;
  handleLikeTimeline: (id: string) => void;
  tempComment: string;
  setTempComment: (val: string) => void;
  handlePostTimelineComment: (id: string) => void;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && event.lat && event.lng) {
          onVisible({ lat: event.lat, lng: event.lng });
        }
      },
      { threshold: 0.1, rootMargin: "-25% 0px -25% 0px" }
    );

    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, [event, onVisible]);

  return (
    <StaggerItem>
      <div 
        ref={itemRef}
        className="relative pl-8 group cursor-crosshair py-12 transition-all duration-500"
        onMouseEnter={() => event.lat && event.lng && onVisible({ lat: event.lat, lng: event.lng })}
      >
        <div className="absolute -left-[5px] top-13 w-2 h-2 bg-background border border-white rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        <div className="space-y-4 bg-background/40 backdrop-blur-sm p-6 rounded-2xl border border-transparent hover:border-border-custom hover:bg-background/60 transition-all duration-500">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-accent group-hover:text-white transition-colors duration-300">
                {event.icon}
                <span className="text-[10px] font-bold tabular-nums tracking-widest">{event.date}</span>
              </div>
              {event.lat && (
                <div className="text-[8px] font-bold text-accent/30 tracking-widest tabular-nums flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>LAT: {event.lat}</span>
                  <span>LNG: {event.lng}</span>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-white transition-colors duration-300 uppercase">{event.title}</h3>
            <p className="text-sm text-accent leading-relaxed max-w-2xl">{event.description}</p>
          </div>

          <div className="flex gap-4 border-t border-border-custom/30 pt-6">
            <button 
              onClick={() => handleLikeTimeline(event.id)} 
              disabled={!user}
              className={`flex items-center gap-2 text-[10px] font-bold transition-all duration-300 group/heart uppercase tracking-widest border px-4 py-2 rounded-full ${
                user 
                ? 'border-white text-white hover:bg-white hover:text-black' 
                : 'border-border-custom/30 text-accent/30 cursor-not-allowed'
              }`}
            >
              <Heart size={12} className={event.likes > 0 ? 'fill-white text-white' : ''} />
              <span>{event.likes} LIKES</span>
            </button>
            <button 
              onClick={() => setActiveCommentId(activeCommentId === event.id ? null : event.id)} 
              disabled={!user}
              className={`flex items-center gap-2 text-[10px] font-bold transition-all duration-300 uppercase tracking-widest border px-4 py-2 rounded-full ${
                user 
                ? 'border-white text-white hover:bg-white hover:text-black' 
                : 'border-border-custom/30 text-accent/30 cursor-not-allowed'
              }`}
            >
              <MessageSquare size={12} />
              <span>{timelineComments[event.id]?.length || 0} COMMENTS</span>
            </button>
          </div>

          {activeCommentId === event.id && user && (
            <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-2">
                <input type="text" value={tempComment} onChange={(e) => setTempComment(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-card border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-white transition-all shadow-sm" onKeyDown={(e) => e.key === 'Enter' && handlePostTimelineComment(event.id)} />
                <button onClick={(e) => { e.preventDefault(); handlePostTimelineComment(event.id); }} className="p-2 bg-white text-black rounded-lg hover:opacity-90"><Send size={12} /></button>
              </div>
            </div>
          )}
          {timelineComments[event.id] && timelineComments[event.id].length > 0 && (
            <div className="space-y-2 mt-4 ml-2">
              {timelineComments[event.id].map((comm: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-1 border-l-2 border-border-custom pl-4 py-1">
                  <p className="text-xs text-foreground">{comm.text}</p>
                  <p className="text-[10px] text-accent uppercase font-bold">{comm.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StaggerItem>
  );
};

export default function TimelineDashboard({ 
  user,
  initialTimeline,
  initialComments
}: { 
  user: any;
  initialTimeline: TimelineEvent[];
  initialComments: Record<string, {text: string, date: string}[]>;
}) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimeline);
  
  useEffect(() => {
    setTimeline(initialTimeline);
  }, [initialTimeline]);

  const [showForm, setShowForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [activeLocation, setActiveLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [timelineComments, setTimelineComments] = useState<Record<string, {text: string, date: string}[]>>(initialComments);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState('');

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newPostContent.trim() || !newPostTitle.trim()) return;
    
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
      title: newPostTitle.toUpperCase(),
      description: newPostContent,
      icon: <Clock size={14} />,
      likes: 0
    };
    setTimeline([newEvent, ...timeline]);
    
    setNewPostContent('');
    setNewPostTitle('');
    setShowForm(false);
  };

  const handleLikeTimeline = (id: string) => {
    if (!user) return;
    setTimeline(timeline.map(event => 
      event.id === id ? { ...event, likes: event.likes + 1 } : event
    ));
  };

  const handlePostTimelineComment = (id: string) => {
    if (!user) return;
    if (!tempComment.trim()) return;
    const newComment = {
      text: tempComment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    setTimelineComments({
      ...timelineComments,
      [id]: [...(timelineComments[id] || []), newComment]
    });
    setTempComment('');
    setActiveCommentId(null);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 relative">
      
      {/* Globe as Background/Interactive Element */}
      <div className="fixed inset-0 pointer-events-none flex items-start justify-center pt-32 opacity-30 z-0">
        <div className="w-[600px] h-[600px]">
          <Globe activeLocation={activeLocation} />
        </div>
      </div>

      <div className="relative z-10 space-y-20">
        {/* Header */}
        <FadeIn>
          <section className="flex justify-between items-center bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border-custom/50">
            <div className="text-xs font-bold text-foreground tracking-[0.2em] uppercase flex items-center gap-2">
              <Clock size={14} className="text-white" />
              THE JOURNEY // {activeLocation ? `${activeLocation.lat.toFixed(2)}°N` : 'GLOBAL'}
            </div>
            {user ? (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="p-1.5 border border-white rounded-md hover:bg-white hover:text-black transition-all text-white"
              >
                <Plus size={16} />
              </button>
            ) : (
              <div className="text-[10px] text-accent font-bold uppercase tracking-widest flex items-center gap-2 italic opacity-60">
                Tracking Active _
              </div>
            )}
          </section>
        </FadeIn>

        {/* Form */}
        {showForm && user && (
          <FadeIn>
            <section className="animate-in fade-in slide-in-from-top-4 duration-500">
              <form onSubmit={handleAddEntry} className="space-y-4 border border-border-custom p-6 rounded-2xl bg-card">
                <div className="text-[9px] font-bold tracking-widest px-3 py-1 rounded border border-white bg-white text-black inline-block uppercase">
                  TIMELINE UPDATE
                </div>
                <input 
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Entry Title..."
                  className="w-full bg-card border border-border-custom rounded-lg px-4 py-2 text-sm outline-none focus:border-white transition-all text-white"
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe the journey..."
                  className="w-full bg-card border border-border-custom rounded-xl p-4 text-sm text-foreground outline-none focus:border-white transition-all min-h-[100px] resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="text-[10px] font-bold text-accent uppercase hover:text-foreground underline underline-offset-4">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-white text-black rounded-lg hover:opacity-90 transition-all text-[10px] font-bold uppercase tracking-widest border border-white">Save Entry</button>
                </div>
              </form>
            </section>
          </FadeIn>
        )}

        {/* Timeline Section */}
        <section className="max-w-2xl mx-auto">
          <StaggerContainer delay={0.2}>
            <div className="relative border-l border-border-custom/50 ml-2 space-y-4">
              {timeline.map((event) => (
                <TimelineItem 
                  key={event.id}
                  event={event}
                  user={user}
                  onVisible={setActiveLocation}
                  timelineComments={timelineComments}
                  activeCommentId={activeCommentId}
                  setActiveCommentId={setActiveCommentId}
                  handleLikeTimeline={handleLikeTimeline}
                  tempComment={tempComment}
                  setTempComment={setTempComment}
                  handlePostTimelineComment={handlePostTimelineComment}
                />
              ))}
            </div>
          </StaggerContainer>
        </section>
      </div>
      
      {!user && (
        <FadeIn delay={0.6}>
          <section className="mt-40 pt-10 border-t border-border-custom text-center relative z-10">
            <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-white hover:underline uppercase tracking-[0.2em]">
              <LogIn size={14} />
              SIGN IN TO ENGAGE _
            </Link>
          </section>
        </FadeIn>
      )}
    </main>
  );
}
