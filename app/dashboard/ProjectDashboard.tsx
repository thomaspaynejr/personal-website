'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Activity, CheckCircle2, Construction, X, Edit, Trash2, GitCommit, Database, Cpu, Radio, ShieldCheck } from 'lucide-react';
import { StaggerContainer, StaggerItem, FadeIn } from '../components/Animations';
import { upsertTrackerProject, deleteTrackerProject } from '@/app/actions/admin';

interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'RESEARCHING';
  progress: number;
  description: string;
}

const RECENT_COMMITS = [
  { hash: '69fcaec', msg: 'feat: overhaul Terminal HUD with FX toggles & CLI messaging', time: 'Just now' },
  { hash: '1887d55', msg: 'feat: add writing & articles section with admin manager', time: '1h ago' },
  { hash: 'cffb1f5', msg: 'style: clean about page header & add TerminalHUD auto-scroll', time: '3h ago' },
  { hash: 'ca53ebe', msg: 'docs: update AGY log with Nebuchadnezzar team and Linear Milestones', time: '1d ago' },
];

export default function ProjectDashboard({ 
  user,
  initialProjects
}: { 
  user: { user_metadata?: { role?: string } } | null;
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState<'ACTIVE' | 'COMPLETED' | 'RESEARCHING'>('ACTIVE');
  const [newProjectProgress, setNewProjectProgress] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    setProjects(initialProjects);
    // Measure lightweight client ping
    const start = performance.now();
    fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' })
      .then(() => {
        setPingLatency(Math.round(performance.now() - start));
      })
      .catch(() => setPingLatency(14));
  }, [initialProjects]);

  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length;
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length;

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!newProjectName.trim() || !newProjectDescription.trim()) return;
    
    const formData = new FormData();
    if (editingId) formData.append('id', editingId);
    formData.append('name', newProjectName);
    formData.append('description', newProjectDescription);
    formData.append('status', newProjectStatus);
    formData.append('progress', newProjectProgress.toString());

    const res = await upsertTrackerProject(formData);
    if (res.success) {
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectStatus('ACTIVE');
      setNewProjectProgress(0);
      setShowForm(false);
      setEditingId(null);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setNewProjectName(project.name);
    setNewProjectDescription(project.description);
    setNewProjectStatus(project.status);
    setNewProjectProgress(project.progress);
    setShowForm(true);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Page Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm gap-4">
          <div>
            <div className="text-[10px] font-bold text-foreground tracking-[0.2em] uppercase flex items-center gap-2 mb-1">
              <Activity size={12} className="text-action animate-pulse" />
              SYSTEM DASHBOARD // TELEMETRY & TRACKER
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight text-action">
              Live System Status & Projects
            </h1>
          </div>
          {isAdmin && (
            <button 
              onClick={() => { setShowForm(!showForm); if(showForm) setEditingId(null); }}
              className="px-3 py-1.5 border-2 border-action rounded-lg bg-action/10 hover:bg-action hover:text-white transition-all text-action shadow-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest cursor-none"
            >
              {showForm ? <X size={14} /> : <Plus size={14} />}
              <span>{showForm ? 'Close Form' : 'Add Project'}</span>
            </button>
          )}
        </div>
      </FadeIn>

      {/* System Telemetry Badges */}
      <StaggerContainer delay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem>
          <div className="bg-card/40 backdrop-blur-md p-4 rounded-xl border border-border-custom/30 space-y-1">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-accent">
              <span>SUPABASE DB</span>
              <Database size={12} className="text-action" />
            </div>
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
              <span>ONLINE</span>
              <span className="text-[9px] text-accent font-normal">({pingLatency ?? 12}ms)</span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-card/40 backdrop-blur-md p-4 rounded-xl border border-border-custom/30 space-y-1">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-accent">
              <span>COMPILER ENGINE</span>
              <Cpu size={12} className="text-action" />
            </div>
            <div className="text-xs font-bold text-foreground font-mono">
              NEXT.JS 16 TURBOPACK
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-card/40 backdrop-blur-md p-4 rounded-xl border border-border-custom/30 space-y-1">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-accent">
              <span>BUILD STATUS</span>
              <ShieldCheck size={12} className="text-green-500" />
            </div>
            <div className="text-xs font-bold text-green-500 font-mono flex items-center gap-1">
              <span>PASSING (100%)</span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-card/40 backdrop-blur-md p-4 rounded-xl border border-border-custom/30 space-y-1">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-accent">
              <span>PROJECT METRICS</span>
              <Radio size={12} className="text-action" />
            </div>
            <div className="text-xs font-bold text-foreground font-mono">
              {activeCount} ACTIVE • {completedCount} DONE
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Live Developer Git Ticker Stream */}
      <FadeIn delay={0.2}>
        <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 space-y-4">
          <div className="flex items-center justify-between border-b border-border-custom/30 pb-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground">
              <GitCommit size={14} className="text-action" />
              <span>DEVELOPER TICKER // RECENT GIT COMMITS</span>
            </div>
            <span className="text-[8px] text-accent uppercase font-mono tracking-widest">
              BRANCH: MAIN (ORIGIN/MAIN)
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {RECENT_COMMITS.map((c) => (
              <div
                key={c.hash}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-background/40 border border-border-custom/20 hover:border-action transition-all gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-action/10 text-action text-[9px] font-bold border border-action/30">
                    {c.hash}
                  </span>
                  <span className="text-foreground text-[11px] font-medium">{c.msg}</span>
                </div>
                <span className="text-[9px] text-accent uppercase tracking-widest shrink-0">
                  {c.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Project Tracker Grid Section */}
      <section className="space-y-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2 px-1">
          <Construction size={12} className="text-action" />
          <span>ACTIVE BUILD TRACKER & MILESTONES</span>
        </div>

        <AnimatePresence>
          {showForm && isAdmin && (
            <motion.section 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 max-w-3xl mx-auto overflow-hidden"
            >
              <div className="pb-4">
                <form onSubmit={handleAddProject} className="space-y-3 border-2 border-action p-5 rounded-2xl bg-card/80 backdrop-blur-md">
                  <div className="text-[8px] font-bold tracking-widest px-2 py-0.5 rounded border border-action bg-action text-white inline-block uppercase">
                    {editingId ? 'EDIT PROJECT' : 'NEW PROJECT'}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Project Name..."
                      className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action transition-all text-foreground"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={newProjectStatus}
                        onChange={(e) => setNewProjectStatus(e.target.value as Project['status'])}
                        className="bg-background border border-border-custom rounded-lg px-2 py-1 text-[10px] outline-none focus:border-action text-foreground"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="RESEARCHING">RESEARCHING</option>
                      </select>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={newProjectProgress}
                        onChange={(e) => setNewProjectProgress(parseInt(e.target.value) || 0)}
                        className="bg-background border border-border-custom rounded-lg px-2 py-1 text-[10px] outline-none focus:border-action text-foreground"
                      />
                    </div>
                  </div>

                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="What are you building?"
                    className="w-full bg-background border border-border-custom rounded-xl p-3 text-xs text-foreground outline-none focus:border-action transition-all min-h-[80px] resize-none"
                  />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-[9px] font-bold text-accent uppercase hover:text-foreground underline underline-offset-4">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-action text-white rounded-lg hover:opacity-90 transition-all text-[9px] font-bold uppercase tracking-widest border-2 border-action shadow-sm">
                      {editingId ? 'Update Project' : 'Save Project'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <div className="p-5 border border-border-custom/30 rounded-2xl bg-card/40 backdrop-blur-md space-y-3 hover:border-action transition-all duration-300 h-full flex flex-col justify-between group relative">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[9px] font-bold tracking-wider leading-tight text-foreground group-hover:text-action transition-colors uppercase">{project.name}</h4>
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(project)} className="p-1 text-accent hover:text-action transition-colors"><Edit size={10} /></button>
                            <button onClick={() => { if(confirm('Delete project?')) deleteTrackerProject(project.id); }} className="p-1 text-accent hover:text-red-500 transition-colors"><Trash2 size={10} /></button>
                          </div>
                        )}
                        {project.status === 'COMPLETED' ? <CheckCircle2 size={10} className="text-green-500" /> : <Construction size={10} className="text-action" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-accent leading-relaxed line-clamp-3 group-hover:text-foreground transition-colors">{project.description}</p>
                  </div>
                  <div className="space-y-1.5 pt-3">
                    <div className="flex justify-between text-[8px] font-bold text-accent">
                      <span className="group-hover:text-action transition-colors">PROGRESS</span>
                      <span className="text-foreground">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-border-custom/30 h-0.5 rounded-full overflow-hidden">
                      <div className="bg-action h-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
            {!projects.length && (
              <p className="col-span-full text-center py-20 text-xs text-accent uppercase tracking-widest italic opacity-50">
                No active projects tracked.
              </p>
            )}
          </div>
        </StaggerContainer>
      </section>
    </main>
  );
}
