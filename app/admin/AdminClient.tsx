'use client';

import { useState } from 'react';
import { Shield, Edit, Trash2, UserMinus, UserCheck, AlertTriangle, Briefcase, Activity, Clock, Plus, X, ExternalLink, Github, Info, Camera } from 'lucide-react';
import { upsertPortfolioProject, deletePortfolioProject, upsertTrackerProject, deleteTrackerProject, upsertTimelineEvent, deleteTimelineEvent, setUserBlockStatus, updateAboutContent } from '@/app/actions/admin';
import { createClient } from '@/lib/supabase/client';

export default function AdminClient({ 
  initialEvents, 
  initialProfiles,
  initialPortfolio,
  initialTracker,
  initialAbout
}: { 
  initialEvents: any[], 
  initialProfiles: any[],
  initialPortfolio: any[],
  initialTracker: any[],
  initialAbout: any
}) {
  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'TRACKER' | 'TIMELINE' | 'USERS' | 'ABOUT'>('PORTFOLIO');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const tabs = [
    { id: 'PORTFOLIO', label: 'Portfolio', icon: <Briefcase size={14} /> },
    { id: 'TRACKER', label: 'Project Tracker', icon: <Activity size={14} /> },
    { id: 'TIMELINE', label: 'Timeline', icon: <Clock size={14} /> },
    { id: 'ABOUT', label: 'About Me', icon: <Info size={14} /> },
    { id: 'USERS', label: 'User Access', icon: <Shield size={14} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border-custom/30 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setEditingId(null);
              setIsAdding(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-action text-background border-2 border-action' 
                : 'border-2 border-transparent text-accent hover:text-foreground hover:bg-card/40'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {activeTab === 'PORTFOLIO' && (
          <PortfolioManager projects={initialPortfolio} editingId={editingId} setEditingId={setEditingId} isAdding={isAdding} setIsAdding={setIsAdding} />
        )}
        {activeTab === 'TRACKER' && (
          <TrackerManager projects={initialTracker} editingId={editingId} setEditingId={setEditingId} isAdding={isAdding} setIsAdding={setIsAdding} />
        )}
        {activeTab === 'TIMELINE' && (
          <TimelineManager events={initialEvents} editingId={editingId} setEditingId={setEditingId} isAdding={isAdding} setIsAdding={setIsAdding} />
        )}
        {activeTab === 'ABOUT' && (
          <AboutManager about={initialAbout} />
        )}
        {activeTab === 'USERS' && (
          <UserManager profiles={initialProfiles} />
        )}
      </div>
    </div>
  );
}

function AboutManager({ about }: { about: any }) {
  const [formData, setFormData] = useState(about || {
    bio_text: '',
    journey_text: '',
    hero_image_url: '',
    profile_image_url: '',
    social_links: [],
    experience_json: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const current_image = formData.hero_image_url || formData.profile_image_url;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, hero_image_url: publicUrl }));
      alert('Photo uploaded! Link: ' + publicUrl);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 px-2">
        <Info size={14} className="text-action" />
        <h2 className="text-xs font-bold uppercase tracking-widest">Manage About Me Content</h2>
      </div>

      <form action={async (fd) => {
        // Ensure social_links and experience_json are included from state
        fd.set('social_links', JSON.stringify(formData.social_links || []));
        fd.set('experience_json', JSON.stringify(formData.experience_json || []));
        fd.set('hero_image_url', formData.hero_image_url || '');
        
        const res = await updateAboutContent(fd);
        if (res.success) alert('About content updated!');
        else alert('Error: ' + res.error);
      }} className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Hero Image</label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1 space-y-3 w-full order-2 md:order-1">
                <div className="space-y-1">
                  <p className="text-[8px] text-accent uppercase font-bold opacity-60 ml-1">
                    {isUploading ? 'Uploading...' : 'Upload New Image'}
                  </p>
                  <input 
                    type="file" 
                    onChange={handleUpload}
                    accept="image/*"
                    disabled={isUploading}
                    className="w-full text-[10px] text-accent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border-custom file:text-[9px] file:font-bold file:bg-action/10 file:text-action hover:file:bg-action/20 cursor-pointer disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] text-accent uppercase font-bold opacity-60 ml-1">Or Paste Image URL</p>
                  <div className="relative">
                    <Camera size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
                    <input 
                      name="hero_image_url_dummy" 
                      value={formData.hero_image_url} 
                      onChange={(e) => setFormData({...formData, hero_image_url: e.target.value})}
                      className="w-full bg-background border border-border-custom rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-action transition-all" 
                      placeholder="https://..." 
                    />
                  </div>
                </div>
              </div>
              {current_image && (
                <div className="w-full md:w-32 aspect-[4/5] rounded-xl border border-border-custom overflow-hidden bg-background/50 order-1 md:order-2">
                  <img src={current_image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Biography (Short Bio)</label>
            <textarea 
              name="bio_text" 
              defaultValue={formData.bio_text} 
              className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action min-h-[100px] resize-none" 
              placeholder="Who are you?" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">The Journey (Story)</label>
            <textarea 
              name="journey_text" 
              defaultValue={formData.journey_text} 
              className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action min-h-[150px] resize-none" 
              placeholder="Tell your story..." 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border-custom/30">
          <button type="submit" className="px-8 py-3 bg-action text-background rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all border-2 border-action">
            Save About Changes _
          </button>
        </div>
      </form>
    </section>
  );
}

function PortfolioManager({ projects, editingId, setEditingId, isAdding, setIsAdding }: any) {
  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Briefcase size={14} className="text-action" />
          Manage Portfolio Projects
        </h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-action text-background rounded-lg text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all border-2 border-action"
        >
          {isAdding ? <><X size={10} /> Cancel</> : <><Plus size={10} /> Add Project</>}
        </button>
      </div>

      {(isAdding || editingId) && (
        <form action={async (formData) => {
          const res = await upsertPortfolioProject(formData);
          if (res.success) { setIsAdding(false); setEditingId(null); }
        }} className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border-2 border-action space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-500">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-action">
            {isAdding ? 'ADD NEW PROJECT' : 'EDIT PROJECT'}
          </h3>
          {editingId && <input type="hidden" name="id" value={editingId} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Title</label>
              <input name="title" required defaultValue={projects.find((p: any) => p.id === editingId)?.title} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action" placeholder="Project Title" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Tech Stack (comma separated)</label>
              <input name="tech" defaultValue={projects.find((p: any) => p.id === editingId)?.tech?.join(', ')} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action" placeholder="Next.js, React, Tailwind" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Description</label>
            <textarea name="description" required defaultValue={projects.find((p: any) => p.id === editingId)?.description} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action min-h-[80px] resize-none" placeholder="Project Description" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Demo URL</label>
              <input name="demo_url" defaultValue={projects.find((p: any) => p.id === editingId)?.demo_url} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action" placeholder="https://..." />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Source URL</label>
              <input name="source_url" defaultValue={projects.find((p: any) => p.id === editingId)?.source_url} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action" placeholder="https://github..." />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Display Order</label>
              <input name="display_order" type="number" defaultValue={projects.find((p: any) => p.id === editingId)?.display_order || 0} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-accent hover:text-foreground">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-action text-background rounded-lg text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all border-2 border-action">
              Save Project _
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project: any) => (
          <div key={project.id} className="bg-card/40 backdrop-blur-md p-5 rounded-2xl border border-border-custom/30 flex flex-col justify-between group hover:border-action/30 transition-all">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-bold uppercase tracking-tight text-foreground">{project.title}</h4>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(project.id); setIsAdding(false); }} className="p-1.5 text-accent hover:text-action transition-colors"><Edit size={12} /></button>
                  <button onClick={() => { if(confirm('Delete this project?')) deletePortfolioProject(project.id); }} className="p-1.5 text-accent hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
              <p className="text-[10px] text-accent line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.tech?.map((t: string) => (
                  <span key={t} className="text-[8px] font-bold bg-action/5 border border-action/20 text-action px-1.5 py-0.5 rounded uppercase">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrackerManager({ projects, editingId, setEditingId, isAdding, setIsAdding }: any) {
  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} className="text-action" />
          Project Tracker
        </h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-action text-background rounded-lg text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all border-2 border-action"
        >
          {isAdding ? <><X size={10} /> Cancel</> : <><Plus size={10} /> New Entry</>}
        </button>
      </div>

      {(isAdding || editingId) && (
        <form action={async (formData) => {
          const res = await upsertTrackerProject(formData);
          if (res.success) { setIsAdding(false); setEditingId(null); }
        }} className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border-2 border-action space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-500">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-action">
            {isAdding ? 'CREATE TRACKER ENTRY' : 'EDIT TRACKER ENTRY'}
          </h3>
          {editingId && <input type="hidden" name="id" value={editingId} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Project Name</label>
              <input name="name" required defaultValue={projects.find((p: any) => p.id === editingId)?.name} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action" placeholder="Name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Status</label>
                <select name="status" defaultValue={projects.find((p: any) => p.id === editingId)?.status || 'ACTIVE'} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="RESEARCHING">RESEARCHING</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Progress %</label>
                <input name="progress" type="number" min="0" max="100" defaultValue={projects.find((p: any) => p.id === editingId)?.progress || 0} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Description</label>
            <textarea name="description" required defaultValue={projects.find((p: any) => p.id === editingId)?.description} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action min-h-[80px] resize-none" placeholder="Details..." />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-accent hover:text-foreground">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-action text-background rounded-lg text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all border-2 border-action">
              Save Entry _
            </button>
          </div>
        </form>
      )}

      <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border-custom/30 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-custom/30 bg-action/5">
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent">Project</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent text-center">Status</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent text-center">Progress</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom/20">
            {projects.map((project: any) => (
              <tr key={project.id} className="hover:bg-action/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-xs font-bold uppercase">{project.name}</div>
                  <div className="text-[8px] text-accent line-clamp-1">{project.description}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-[8px] font-bold border px-2 py-0.5 rounded border-border-custom">{project.status}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-[9px] font-bold">{project.progress}%</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditingId(project.id); setIsAdding(false); }} className="p-1.5 text-accent hover:text-action transition-colors"><Edit size={12} /></button>
                    <button onClick={() => { if(confirm('Delete this entry?')) deleteTrackerProject(project.id); }} className="p-1.5 text-accent hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TimelineManager({ events, editingId, setEditingId, isAdding, setIsAdding }: any) {
  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} className="text-action" />
          The Journey Timeline
        </h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-action text-background rounded-lg text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all border-2 border-action"
        >
          {isAdding ? <><X size={10} /> Cancel</> : <><Plus size={10} /> New Event</>}
        </button>
      </div>

      {(isAdding || editingId) && (
        <form action={async (formData) => {
          const res = await upsertTimelineEvent(formData);
          if (res.success) { setIsAdding(false); setEditingId(null); }
        }} className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border-2 border-action space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-500">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-action">
            {isAdding ? 'LOG NEW JOURNEY EVENT' : 'EDIT EVENT'}
          </h3>
          {editingId && <input type="hidden" name="id" value={editingId} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Event Title</label>
              <input name="title" required defaultValue={events.find((e: any) => e.id === editingId)?.title} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action" placeholder="Title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Date</label>
                <input name="date" required defaultValue={events.find((e: any) => e.id === editingId)?.date} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action" placeholder="MAY 2026" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Icon Type</label>
                <select name="icon_type" defaultValue={events.find((e: any) => e.id === editingId)?.icon_type || 'clock'} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action">
                  <option value="clock">CLOCK</option>
                  <option value="plus">PLUS</option>
                  <option value="activity">ACTIVITY</option>
                  <option value="heart">HEART</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-accent uppercase tracking-widest ml-1">Description</label>
            <textarea name="description" required defaultValue={events.find((e: any) => e.id === editingId)?.description} className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action min-h-[80px] resize-none" placeholder="Describe the moment..." />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-accent hover:text-foreground">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-action text-background rounded-lg text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all border-2 border-action">
              Log Event _
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {events.map((event: any) => (
          <div key={event.id} className="bg-card/40 backdrop-blur-md p-5 rounded-2xl border border-border-custom/30 space-y-3 transition-all hover:border-action/30">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-action uppercase tracking-widest">{event.date}</span>
                <span className="text-xs font-bold uppercase text-foreground">{event.title}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(event.id); setIsAdding(false); }} className="p-1.5 text-accent hover:text-action transition-colors"><Edit size={12} /></button>
                <button onClick={() => { if(confirm('Delete this event?')) deleteTimelineEvent(event.id); }} className="p-1.5 text-accent hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
            <p className="text-[10px] text-accent leading-relaxed">{event.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function UserManager({ profiles }: any) {
  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 px-2">
        <AlertTriangle size={14} className="text-action" />
        <h2 className="text-xs font-bold uppercase tracking-widest">User Access Control</h2>
      </div>

      <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border-custom/30 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-custom/30 bg-action/5">
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent">Username</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent text-center">Status</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-accent text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom/20">
            {profiles.map((profile: any) => (
              <tr key={profile.id} className="hover:bg-action/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-xs font-bold text-foreground">{profile.username || 'Anonymous'}</div>
                  <div className="text-[8px] text-accent font-mono uppercase opacity-50">{profile.id.substring(0, 8)}...</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${profile.is_blocked ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                    {profile.is_blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={async () => {
                    await setUserBlockStatus(profile.id, !profile.is_blocked);
                  }}>
                    <button className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${profile.is_blocked ? 'text-green-500 hover:text-green-400' : 'text-red-500 hover:text-red-400'}`}>
                      {profile.is_blocked ? (
                        <><UserCheck size={10} /> Restore Access</>
                      ) : (
                        <><UserMinus size={10} /> Block User</>
                      )}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {!profiles?.length && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-xs text-accent italic uppercase">No users indexed in profiles table.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
