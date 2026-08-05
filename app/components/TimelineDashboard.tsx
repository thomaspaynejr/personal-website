'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MessageSquare, Plus, X, LogIn, Activity, Edit, Trash2, Search, Filter, Code, Copy, Check, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { StaggerContainer, StaggerItem, FadeIn } from './Animations';
import { upsertTimelineEvent, deleteTimelineEvent } from '@/app/actions/admin';
import { toggleTimelineLike, postTimelineComment } from '@/app/actions/engagement';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  likes: number;
  commentsCount?: number;
  userHasLiked?: boolean;
  code_snippet?: string;
  image_url?: string;
}

interface Comment {
  id: string;
  text: string;
  date: string;
  username: string;
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
  handlePostTimelineComment,
  isAdmin,
  setEditingEvent
}: { 
  event: TimelineEvent; 
  user: { user_metadata?: { role?: string } } | null; 
  timelineComments: Record<string, Comment[]>;
  activeCommentId: string | null;
  setActiveCommentId: (id: string | null) => void;
  handleLikeTimeline: (id: string) => void;
  tempComment: string;
  setTempComment: (val: string) => void;
  handlePostTimelineComment: (id: string) => void;
  isAdmin: boolean;
  setEditingEvent: (e: TimelineEvent) => void;
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <StaggerItem>
      <div className="relative pl-6 group py-6 transition-all duration-500">
        <div className="absolute -left-[4px] top-7 w-2 h-2 bg-background border border-action rounded-full transition-all duration-300 group-hover:scale-125 group-hover:bg-action" />
        <div className="space-y-3 bg-card/40 backdrop-blur-md p-5 rounded-2xl border border-transparent hover:border-action/50 transition-all duration-500">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent group-hover:text-action transition-colors duration-300">
                {event.icon}
                <span className="text-[9px] font-bold tabular-nums tracking-widest">{event.date}</span>
              </div>
              {isAdmin && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingEvent(event)} className="p-1 text-accent hover:text-action transition-colors"><Edit size={12} /></button>
                  <button onClick={() => { if(confirm('Delete event?')) deleteTimelineEvent(event.id); }} className="p-1 text-accent hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-action transition-colors duration-300 uppercase">{event.title}</h3>
            <p className="text-xs text-accent leading-relaxed max-w-2xl">{event.description}</p>
          </div>

          {/* Optional Formatted Code Snippet Block */}
          {event.code_snippet && (
            <div className="relative mt-3 rounded-xl border border-border-custom/40 bg-background/80 overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-card/60 border-b border-border-custom/30 text-[9px] font-bold uppercase tracking-widest text-accent">
                <span className="flex items-center gap-1.5">
                  <Code size={10} className="text-action" />
                  Code Snippet
                </span>
                <button
                  onClick={() => handleCopyCode(event.code_snippet!)}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  {copiedCode ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                  <span>{copiedCode ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <pre className="p-3 text-[10px] text-foreground/90 overflow-x-auto whitespace-pre leading-relaxed">
                <code>{event.code_snippet}</code>
              </pre>
            </div>
          )}

          {/* Optional Image Attachment Preview & Lightbox Modal */}
          {event.image_url && (
            <div className="mt-3">
              <button
                onClick={() => setShowLightbox(true)}
                className="group/img relative rounded-xl border border-border-custom/30 overflow-hidden block max-w-md hover:border-action transition-all"
              >
                <img 
                  src={event.image_url} 
                  alt={event.title} 
                  className="w-full h-40 object-cover group-hover/img:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-[9px] text-white font-bold uppercase tracking-widest gap-1">
                  <ImageIcon size={12} />
                  <span>Expand Preview</span>
                </div>
              </button>

              {/* Lightbox Modal */}
              <AnimatePresence>
                {showLightbox && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowLightbox(false)}
                    className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20"
                    >
                      <button
                        onClick={() => setShowLightbox(false)}
                        className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black"
                      >
                        <X size={16} />
                      </button>
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-contain max-h-[85vh]" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="flex gap-3 border-t border-border-custom/30 pt-4">
            <button 
              onClick={() => handleLikeTimeline(event.id)} 
              disabled={!user}
              className={`flex items-center gap-2 text-[9px] font-bold transition-all duration-300 group/heart uppercase tracking-widest border px-3 py-1.5 rounded-full ${
                user 
                ? 'border-action text-action hover:bg-action hover:text-background' 
                : 'border-border-custom text-accent/30 cursor-not-allowed'
              } ${event.userHasLiked ? 'bg-action text-background' : ''}`}
            >
              <Heart size={10} className={event.userHasLiked ? 'fill-background text-background' : ''} />
              <span>{event.likes} LIKES</span>
            </button>
            <button 
              onClick={() => setActiveCommentId(activeCommentId === event.id ? null : event.id)} 
              disabled={!user}
              className={`flex items-center gap-2 text-[9px] font-bold transition-all duration-300 uppercase tracking-widest border px-3 py-1.5 rounded-full ${
                user 
                ? 'border-action text-action hover:bg-action hover:text-background' 
                : 'border-border-custom text-accent/30 cursor-not-allowed'
              }`}
            >
              <MessageSquare size={10} />
              <span>{event.commentsCount || timelineComments[event.id]?.length || 0} COMMENTS</span>
            </button>
          </div>

          <AnimatePresence>
            {activeCommentId === event.id && user && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 mt-4 overflow-hidden"
              >
                <div className="flex gap-2 pb-1">
                  <input type="text" value={tempComment} onChange={(e) => setTempComment(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action transition-all shadow-sm" onKeyDown={(e) => e.key === 'Enter' && handlePostTimelineComment(event.id)} />
                  <button onClick={(e) => { e.preventDefault(); handlePostTimelineComment(event.id); }} className="p-2 bg-action text-background rounded-lg hover:opacity-90"><Send size={12} className="text-foreground" /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {timelineComments[event.id] && timelineComments[event.id].length > 0 && (
            <div className="space-y-2 mt-4 ml-2">
              {timelineComments[event.id].map((comm, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-l-2 border-border-custom pl-4 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-action uppercase tracking-tighter">{comm.username}</span>
                    <span className="text-[8px] text-accent uppercase font-bold">{comm.date}</span>
                  </div>
                  <p className="text-xs text-foreground">{comm.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StaggerItem>
  );
};

const CATEGORIES = ['ALL', 'BUILD', 'MILESTONE', 'MILITARY', 'LEARNING'];

export default function TimelineDashboard({ 
  user,
  initialTimeline,
  initialComments
}: { 
  user: { user_metadata?: { role?: string } } | null; 
  initialTimeline: TimelineEvent[];
  initialComments: Record<string, Comment[]>;
}) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimeline);
  const [showForm, setShowForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  
  const [timelineComments] = useState<Record<string, Comment[]>>(initialComments);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    setTimeline(initialTimeline);
  }, [initialTimeline]);

  // Filter timeline events by category & search query
  const filteredTimeline = useMemo(() => {
    return timeline.filter((event) => {
      const matchesSearch = 
        searchQuery.trim() === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' ||
        event.title.toUpperCase().includes(selectedCategory) ||
        event.description.toUpperCase().includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [timeline, searchQuery, selectedCategory]);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    const formData = new FormData();
    if (editingEvent) formData.append('id', editingEvent.id);
    formData.append('title', newPostTitle);
    formData.append('description', newPostContent);
    formData.append('date', editingEvent?.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase());

    const res = await upsertTimelineEvent(formData);
    if (res.success) {
      setNewPostContent('');
      setNewPostTitle('');
      setShowForm(false);
      setEditingEvent(null);
    }
  };

  const handleLikeTimeline = async (id: string) => {
    if (!user) return;
    
    const updatedTimeline = timeline.map(event => {
      if (event.id === id) {
        const hasLiked = event.userHasLiked;
        return { 
          ...event, 
          likes: hasLiked ? event.likes - 1 : event.likes + 1,
          userHasLiked: !hasLiked
        };
      }
      return event;
    });
    setTimeline(updatedTimeline);

    const res = await toggleTimelineLike(id);
    if (res.error) {
      setTimeline(timeline);
      alert(res.error);
    }
  };

  const handlePostTimelineComment = async (id: string) => {
    if (!user) return;
    if (!tempComment.trim()) return;
    
    const text = tempComment;
    setTempComment('');
    setActiveCommentId(null);

    const res = await postTimelineComment(id, text);
    if (res.error) {
      alert(res.error);
      setTempComment(text);
    }
  };

  useEffect(() => {
    if (editingEvent) {
      setNewPostTitle(editingEvent.title);
      setNewPostContent(editingEvent.description);
      setShowForm(true);
    }
  }, [editingEvent]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-8 relative">
      <div className="relative space-y-8">
        {/* Header */}
        <FadeIn>
          <section className="bg-card/40 backdrop-blur-md p-5 rounded-2xl border border-border-custom/30 shadow-sm max-w-3xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-bold text-foreground tracking-[0.2em] uppercase flex items-center gap-2">
                <Activity size={12} className="text-action animate-pulse" />
                THE JOURNEY // ACTIVITY FEED
              </div>
              {isAdmin ? (
                <button 
                  onClick={() => { setShowForm(!showForm); if(showForm) setEditingEvent(null); }}
                  className="p-1 border-2 border-action rounded-md hover:bg-action hover:text-background transition-all text-action shadow-sm"
                >
                  {showForm ? <X size={14} /> : <Plus size={14} />}
                </button>
              ) : (
                <div className="text-[9px] text-accent font-bold uppercase tracking-widest flex items-center gap-2 italic opacity-60">
                  Tracking Active _
                </div>
              )}
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center pt-2 border-t border-border-custom/20">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
                <input
                  type="text"
                  placeholder="Filter journey events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background/50 border border-border-custom/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-action transition-all"
                />
              </div>

              {/* Tag Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter size={10} className="text-action shrink-0 mr-1" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider transition-all ${
                      selectedCategory === cat
                        ? 'bg-action text-background border border-action'
                        : 'bg-background/40 text-accent hover:text-foreground border border-border-custom/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Form */}
        <AnimatePresence>
          {showForm && isAdmin && (
            <motion.section 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-3xl mx-auto overflow-hidden"
            >
              <div className="pb-4">
                <form onSubmit={handleAddEntry} className="space-y-3 border-2 border-action p-5 rounded-2xl bg-card/80 backdrop-blur-md">
                  <div className="flex gap-3 mb-1">
                    <div className={`text-[8px] font-bold tracking-widest px-2 py-0.5 rounded border transition-all bg-action text-background border-action uppercase`}>
                      {editingEvent ? 'EDITING EVENT' : 'NEW JOURNEY EVENT'}
                    </div>
                  </div>
                  <input 
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Entry Title..."
                    className="w-full bg-background border border-border-custom rounded-lg px-3 py-1.5 text-xs outline-none focus:border-action transition-all text-foreground"
                  />
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Describe the journey..."
                    className="w-full bg-background border border-border-custom rounded-xl p-3 text-xs text-foreground outline-none focus:border-action transition-all min-h-[80px] resize-none"
                  />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => { setShowForm(false); setEditingEvent(null); }} className="text-[9px] font-bold text-accent uppercase hover:text-foreground underline underline-offset-4">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-action text-background rounded-lg hover:opacity-90 transition-all text-[9px] font-bold uppercase tracking-widest border-2 border-action shadow-sm">
                      {editingEvent ? 'Update Event' : 'Save Entry'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Timeline Section */}
        <section className="max-w-2xl mx-auto">
          <StaggerContainer delay={0.2}>
            <div className="relative border-l border-border-custom/50 ml-2 space-y-4">
              {filteredTimeline.map((event) => (
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
                  isAdmin={isAdmin}
                  setEditingEvent={setEditingEvent}
                />
              ))}
              {!filteredTimeline.length && (
                <p className="text-center py-20 text-xs text-accent uppercase tracking-widest italic opacity-50">
                  No journey events match your search or filter.
                </p>
              )}
            </div>
          </StaggerContainer>
        </section>
      </div>
      
      {!user && (
        <FadeIn delay={0.6}>
          <section className="mt-40 pt-10 border-t border-border-custom text-center">
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
