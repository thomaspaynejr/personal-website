'use client';

import { useState } from 'react';
import { Send, Clock, MapPin, Award, Laptop, Heart, MessageSquare, Plus, X, Activity, CheckCircle2, Construction } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  likes: number;
}

interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'RESEARCHING';
  progress: number;
  description: string;
}

const initialTimeline: TimelineEvent[] = [
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
  }
];

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: "PERSONAL PORTFOLIO",
    status: 'ACTIVE',
    progress: 95,
    description: "Refining minimalist Yeezy-inspired UI and dashboard features."
  },
  {
    id: 'p2',
    name: "ARMY LOGISTICS TRACKER",
    status: 'RESEARCHING',
    progress: 20,
    description: "Building a high-efficiency inventory tool based on military supply principles."
  },
  {
    id: 'p3',
    name: "TICKET DASHBOARD V2",
    status: 'ACTIVE',
    progress: 45,
    description: "Streamlined support dashboard for desktop troubleshooting teams."
  }
];

export default function Home() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimeline);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'TIMELINE' | 'PROJECT'>('TIMELINE');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  
  const [timelineComments, setTimelineComments] = useState<Record<string, {text: string, date: string}[]>>({});
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !newPostTitle.trim()) return;
    
    if (formType === 'TIMELINE') {
      const newEvent: TimelineEvent = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
        title: newPostTitle.toUpperCase(),
        description: newPostContent,
        icon: <Clock size={14} />,
        likes: 0
      };
      setTimeline([newEvent, ...timeline]);
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newPostTitle.toUpperCase(),
        status: 'ACTIVE',
        progress: 10,
        description: newPostContent
      };
      setProjects([newProject, ...projects]);
    }
    
    setNewPostContent('');
    setNewPostTitle('');
    setShowForm(false);
  };

  const handleLikeTimeline = (id: string) => {
    setTimeline(timeline.map(event => 
      event.id === id ? { ...event, likes: event.likes + 1 } : event
    ));
  };

  const handlePostTimelineComment = (id: string) => {
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
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-20">
      
      {/* Dashboard // Project Tracker */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-action tracking-[0.2em] uppercase flex items-center gap-2">
            <Activity size={14} className="animate-pulse" />
            DASHBOARD // PROJECT TRACKER
          </div>
          <button 
            onClick={() => { setShowForm(!showForm); setFormType('PROJECT'); }}
            className="p-1.5 border border-border-custom rounded-md hover:border-action transition-all text-accent hover:text-action"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="p-5 border border-border-custom rounded-2xl bg-card/20 space-y-4 hover:border-action/50 transition-colors">
              <div className="flex justify-between items-start">
                <h4 className="text-[10px] font-bold tracking-wider leading-tight">{project.name}</h4>
                {project.status === 'COMPLETED' ? <CheckCircle2 size={12} className="text-green-500" /> : <Construction size={12} className="text-action" />}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-accent">
                  <span>PROGRESS</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-border-custom/30 h-1 rounded-full overflow-hidden">
                  <div className="bg-action h-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
              <p className="text-[10px] text-accent leading-relaxed line-clamp-2">{project.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Post / Timeline Header */}
      <section className="flex justify-between items-center pt-10 border-t border-border-custom">
        <div className="text-xs font-bold text-action tracking-[0.2em] uppercase flex items-center gap-2">
          <Clock size={14} />
          TIMELINE // THE JOURNEY
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setFormType('TIMELINE'); }}
          className="p-1.5 border border-border-custom rounded-md hover:border-action transition-all text-accent hover:text-action"
        >
          <Plus size={16} />
        </button>
      </section>

      {/* Unified Entry Form */}
      {showForm && (
        <section className="animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleAddEntry} className="space-y-4 border border-border-custom p-6 rounded-2xl bg-card">
            <div className="flex gap-4 mb-2">
              <button 
                type="button"
                onClick={() => setFormType('TIMELINE')}
                className={`text-[9px] font-bold tracking-widest px-3 py-1 rounded border transition-all ${formType === 'TIMELINE' ? 'bg-action text-background border-action' : 'border-border-custom text-accent'}`}
              >
                TIMELINE UPDATE
              </button>
              <button 
                type="button"
                onClick={() => setFormType('PROJECT')}
                className={`text-[9px] font-bold tracking-widest px-3 py-1 rounded border transition-all ${formType === 'PROJECT' ? 'bg-action text-background border-action' : 'border-border-custom text-accent'}`}
              >
                NEW PROJECT
              </button>
            </div>
            <input 
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder={formType === 'TIMELINE' ? "Entry Title..." : "Project Name..."}
              className="w-full bg-card border border-border-custom rounded-lg px-4 py-2 text-sm outline-none focus:border-action transition-all"
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={formType === 'TIMELINE' ? "Describe the journey..." : "What are you building?"}
              className="w-full bg-card border border-border-custom rounded-xl p-4 text-sm text-foreground outline-none focus:border-action transition-all min-h-[100px] resize-none"
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="text-[10px] font-bold text-accent uppercase hover:text-foreground underline underline-offset-4">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-action text-background rounded-lg hover:opacity-90 transition-all text-[10px] font-bold uppercase tracking-tighter">Save Entry _</button>
            </div>
          </form>
        </section>
      )}

      {/* Timeline Section */}
      <section>
        <div className="relative border-l border-border-custom ml-2 space-y-16">
          {timeline.map((event) => (
            <div key={event.id} className="relative pl-8">
              <div className="absolute -left-[5px] top-1 w-2 h-2 bg-background border border-action rounded-full" />
              <div className="space-y-4 group">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-accent/50 group-hover:text-action transition-colors duration-300">
                    {event.icon}
                    <span className="text-[10px] font-bold tabular-nums tracking-widest">{event.date}</span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{event.title}</h3>
                  <p className="text-sm text-accent leading-relaxed max-w-2xl">{event.description}</p>
                </div>
                <div className="flex gap-4 border-t border-border-custom pt-4">
                  <button onClick={() => handleLikeTimeline(event.id)} className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-action transition-colors group/heart uppercase tracking-tighter">
                    <Heart size={14} className={event.likes > 0 ? 'fill-action text-action' : ''} />
                    <span>{event.likes} LIKES</span>
                  </button>
                  <button onClick={() => setActiveCommentId(activeCommentId === event.id ? null : event.id)} className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-action transition-colors uppercase tracking-tighter">
                    <MessageSquare size={14} />
                    <span>{timelineComments[event.id]?.length || 0} COMMENTS</span>
                  </button>
                </div>
                {activeCommentId === event.id && (
                  <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2">
                      <input type="text" value={tempComment} onChange={(e) => setTempComment(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-card border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action transition-all shadow-sm" onKeyDown={(e) => e.key === 'Enter' && handlePostTimelineComment(event.id)} />
                      <button onClick={() => handlePostTimelineComment(event.id)} className="p-2 bg-action text-background rounded-lg hover:opacity-90"><Send size={12} /></button>
                    </div>
                  </div>
                )}
                {timelineComments[event.id] && timelineComments[event.id].length > 0 && (
                  <div className="space-y-2 mt-4 ml-2">
                    {timelineComments[event.id].map((comm, idx) => (
                      <div key={idx} className="flex flex-col gap-1 border-l-2 border-border-custom pl-4 py-1">
                        <p className="text-xs text-foreground">{comm.text}</p>
                        <p className="text-[10px] text-accent uppercase font-bold">{comm.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}