'use client';

import { useState } from 'react';
import { Plus, Activity, CheckCircle2, Construction } from 'lucide-react';
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
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <section className="space-y-8">
        <FadeIn>
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-foreground tracking-[0.2em] uppercase flex items-center gap-2">
              <Activity size={14} className="text-action animate-pulse" />
              DASHBOARD // PROJECT TRACKER
            </div>
            {user && (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="p-1.5 border border-action rounded-md hover:bg-action hover:text-white transition-all text-action"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </FadeIn>

        {showForm && user && (
          <FadeIn>
            <section className="animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
              <form onSubmit={handleAddProject} className="space-y-4 border border-border-custom p-6 rounded-2xl bg-card/80 backdrop-blur-md">
                <div className="text-[9px] font-bold tracking-widest px-3 py-1 rounded border border-action bg-action text-white inline-block uppercase">
                  NEW PROJECT
                </div>
                <input 
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project Name..."
                  className="w-full bg-background border border-border-custom rounded-lg px-4 py-2 text-sm outline-none focus:border-action transition-all text-foreground"
                />
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="What are you building?"
                  className="w-full bg-background border border-border-custom rounded-xl p-4 text-sm text-foreground outline-none focus:border-action transition-all min-h-[100px] resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="text-[10px] font-bold text-accent uppercase hover:text-foreground underline underline-offset-4">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-action text-white rounded-lg hover:opacity-90 transition-all text-[10px] font-bold uppercase tracking-widest border border-action">Save Project</button>
                </div>
              </form>
            </section>
          </FadeIn>
        )}

        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <div className="p-5 border border-border-custom rounded-2xl bg-card/20 space-y-4 hover:border-action/50 transition-colors h-full flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[10px] font-bold tracking-wider leading-tight text-foreground group-hover:text-action transition-colors">{project.name}</h4>
                      {project.status === 'COMPLETED' ? <CheckCircle2 size={12} className="text-green-500" /> : <Construction size={12} className="text-action" />}
                    </div>
                    <p className="text-[10px] text-accent leading-relaxed line-clamp-3 group-hover:text-foreground transition-colors">{project.description}</p>
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-[9px] font-bold text-accent">
                      <span className="group-hover:text-action transition-colors">PROGRESS</span>
                      <span className="text-foreground">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-border-custom/30 h-1 rounded-full overflow-hidden">
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
