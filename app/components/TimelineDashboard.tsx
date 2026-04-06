'use client';

import { useState, useEffect } from 'react';
import { Send, Clock, Heart, MessageSquare, Plus, X, LogIn, Activity } from 'lucide-react';
import Link from 'next/link';
import { StaggerContainer, StaggerItem, FadeIn } from './Animations';
import MatrixRain from './MatrixRain';
import LightStrike from './LightStrike';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  likes: number;
}

const TimelineItem = ({ 
  event, 
  user, 
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
  timelineComments: any;
  activeCommentId: string | null;
  setActiveCommentId: (id: string | null) => void;
  handleLikeTimeline: (id: string) => void;
  tempComment: string;
  setTempComment: (val: string) => void;
  handlePostTimelineComment: (id: string) => void;
}) => {
  return (
    <StaggerItem>
      <div className="relative pl-8 group py-8 transition-all duration-500">
        <div className="absolute -left-[5px] top-9 w-2.5 h-2.5 bg-background border border-action rounded-full transition-all duration-300 group-hover:scale-125 group-hover:bg-action group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        <div className="space-y-4 bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-transparent hover:border-action transition-all duration-500">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-accent group-hover:text-action transition-colors duration-300">
                {event.icon}
                <span className="text-[10px] font-bold tabular-nums tracking-widest">{event.date}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-action transition-colors duration-300 uppercase">{event.title}</h3>
            <p className="text-sm text-accent leading-relaxed max-w-2xl">{event.description}</p>
          </div>

          <div className="flex gap-4 border-t border-border-custom/30 pt-6">
            <button 
              onClick={() => handleLikeTimeline(event.id)} 
              disabled={!user}
              className={`flex items-center gap-2 text-[10px] font-bold transition-all duration-300 group/heart uppercase tracking-widest border-2 px-4 py-2 rounded-full ${
                user 
                ? 'border-action text-action hover:bg-action hover:text-background' 
                : 'border-border-custom text-accent/30 cursor-not-allowed'
              }`}
            >
              <Heart size={12} className={event.likes > 0 ? 'fill-action text-action' : ''} />
              <span>{event.likes} LIKES</span>
            </button>
            <button 
              onClick={() => setActiveCommentId(activeCommentId === event.id ? null : event.id)} 
              disabled={!user}
              className={`flex items-center gap-2 text-[10px] font-bold transition-all duration-300 uppercase tracking-widest border-2 px-4 py-2 rounded-full ${
                user 
                ? 'border-action text-action hover:bg-action hover:text-background' 
                : 'border-border-custom text-accent/30 cursor-not-allowed'
              }`}
            >
              <MessageSquare size={12} />
              <span>{timelineComments[event.id]?.length || 0} COMMENTS</span>
            </button>
          </div>

          {activeCommentId === event.id && user && (
            <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-2">
                <input type="text" value={tempComment} onChange={(e) => setTempComment(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action transition-all shadow-sm" onKeyDown={(e) => e.key === 'Enter' && handlePostTimelineComment(event.id)} />
                <button onClick={(e) => { e.preventDefault(); handlePostTimelineComment(event.id); }} className="p-2 bg-action text-background rounded-lg hover:opacity-90"><Send size={12} className="text-foreground" /></button>
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
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'TIMELINE' | 'PROJECT'>('TIMELINE');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  
  const [timelineComments, setTimelineComments] = useState<Record<string, {text: string, date: string}[]>>(initialComments);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState('');

  useEffect(() => {
    setTimeline(initialTimeline);
  }, [initialTimeline]);

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
    <main className="max-w-6xl mx-auto px-6 py-10 relative min-h-screen">
      <LightStrike />
      
      <div className="relative z-10 space-y-20">
        {/* Header */}
        <FadeIn>
          <section className="flex justify-between items-center bg-card/10 backdrop-blur-md p-6 rounded-2xl border border-border-custom/50 shadow-sm max-w-4xl mx-auto">
            <div className="text-xs font-bold text-foreground tracking-[0.2em] uppercase flex items-center gap-2">
              <Activity size={14} className="text-action animate-pulse" />
              THE JOURNEY // ACTIVITY FEED
            </div>
            {user ? (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="p-1.5 border-2 border-action rounded-md hover:bg-action hover:text-background transition-all text-action shadow-sm"
              >
                {showForm ? <X size={16} /> : <Plus size={16} />}
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
              <form onSubmit={handleAddEntry} className="space-y-4 border-2 border-action p-6 rounded-2xl bg-card/80 backdrop-blur-md">
                <div className="flex gap-4 mb-2">
                  <button 
                    type="button"
                    onClick={() => setFormType('TIMELINE')}
                    className={`text-[9px] font-bold tracking-widest px-3 py-1 rounded border-2 transition-all ${formType === 'TIMELINE' ? 'bg-action text-background border-action shadow-sm' : 'border-border-custom text-accent hover:border-action'}`}
                  >
                    TIMELINE UPDATE
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormType('PROJECT')}
                    className={`text-[9px] font-bold tracking-widest px-3 py-1 rounded border-2 transition-all ${formType === 'PROJECT' ? 'bg-action text-background border-action shadow-sm' : 'border-border-custom text-accent hover:border-action'}`}
                  >
                    NEW PROJECT
                  </button>
                </div>
                <input 
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Entry Title..."
                  className="w-full bg-background border border-border-custom rounded-lg px-4 py-2 text-sm outline-none focus:border-action transition-all text-foreground"
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe the journey..."
                  className="w-full bg-background border border-border-custom rounded-xl p-4 text-sm text-foreground outline-none focus:border-action transition-all min-h-[100px] resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="text-[10px] font-bold text-accent uppercase hover:text-foreground underline underline-offset-4">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-action text-background rounded-lg hover:opacity-90 transition-all text-[10px] font-bold uppercase tracking-widest border-2 border-action shadow-sm">Save Entry</button>
                </div>
              </form>
            </section>
          </FadeIn>
        )}

        {/* Timeline Section */}
        <section className="max-w-3xl mx-auto">
          <StaggerContainer delay={0.2}>
            <div className="relative border-l border-border-custom/50 ml-2 space-y-4">
              {timeline.map((event) => (
                <TimelineItem 
                  key={event.id}
                  event={event}
                  user={user}
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
            <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-action hover:underline uppercase tracking-[0.2em]">
              <LogIn size={14} />
              SIGN IN TO ENGAGE _
            </Link>
          </section>
        </FadeIn>
      )}
    </main>
  );
}
