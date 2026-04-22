'use client';

import { useState } from 'react';
import { Plus, Activity, CheckCircle2, Construction, X } from 'lucide-react';
import { StaggerContainer, StaggerItem, FadeIn } from '../components/Animations';

interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'RESEARCHING';
  progress: number;
  description: string;
}

export default function ProjectDashboard({ 
  user,
  initialProjects
}: { 
  user: any;
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newProjectName.trim() || !newProjectDescription.trim()) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.toUpperCase(),
      status: 'ACTIVE',
      progress: 10,
      description: newProjectDescription
    };
    setProjects([newProject, ...projects]);
    
    setNewProjectName('');
    setNewProjectDescription('');
    setShowForm(false);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <section className="space-y-6">
        <FadeIn>
          <div className="flex justify-between items-center max-w-3xl mx-auto bg-card/40 backdrop-blur-md p-5 rounded-xl border border-border-custom/30 shadow-sm">
            <div className="text-[10px] font-bold text-foreground tracking-[0.2em] uppercase flex items-center gap-2">
              <Activity size={12} className="text-action animate-pulse" />
              DASHBOARD // PROJECT TRACKER
            </div>
            {user && (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="p-1 border-2 border-action rounded-md hover:bg-action hover:text-white transition-all text-action shadow-sm"
              >
                {showForm ? <X size={14} /> : <Plus size={14} />}
              </button>
            )}
          </div>
        </FadeIn>

        {showForm && user && (
          <FadeIn>
            <section className="animate-in fade-in slide-in-from-top-4 duration-500 mb-6 max-w-3xl mx-auto">
              <form onSubmit={handleAddProject} className="space-y-3 border-2 border-action p-5 rounded-2xl bg-card/80 backdrop-blur-md">
                <div className="text-[8px] font-bold tracking-widest px-2 py-0.5 rounded border border-action bg-action text-white inline-block uppercase">
                  NEW PROJECT
                </div>
                <input 
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project Name..."
                  className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action transition-all text-foreground"
                />
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="What are you building?"
                  className="w-full bg-background border border-border-custom rounded-xl p-3 text-xs text-foreground outline-none focus:border-action transition-all min-h-[80px] resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="text-[9px] font-bold text-accent uppercase hover:text-foreground underline underline-offset-4">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-action text-white rounded-lg hover:opacity-90 transition-all text-[9px] font-bold uppercase tracking-widest border-2 border-action shadow-sm">Save Project</button>
                </div>
              </form>
            </section>
          </FadeIn>
        )}

        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <div className="p-5 border border-border-custom/30 rounded-2xl bg-card/40 backdrop-blur-md space-y-3 hover:border-action transition-all duration-300 h-full flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[9px] font-bold tracking-wider leading-tight text-foreground group-hover:text-action transition-colors uppercase">{project.name}</h4>
                      {project.status === 'COMPLETED' ? <CheckCircle2 size={10} className="text-green-500" /> : <Construction size={10} className="text-action" />}
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
          </div>
        </StaggerContainer>
      </section>
    </main>
  );
}
