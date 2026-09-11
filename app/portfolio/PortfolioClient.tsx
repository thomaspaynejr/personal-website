'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Laptop, ArrowUpRight, ExternalLink, BookOpen } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import TechIcon from '../components/TechIcon';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';

export interface PortfolioProject {
  id: string;
  slug?: string;
  title: string;
  description: string;
  tech?: string[];
  demo_url?: string;
  source_url?: string;
  display_order?: number;
  case_study?: string;
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function PortfolioClient({ initialProjects }: { initialProjects: PortfolioProject[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Extract all unique tech tags
  const allTechTags = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => p.tech?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [initialProjects]);

  // Filter projects by search and selected tech
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tech?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTech = !selectedTech || project.tech?.includes(selectedTech);

      return matchesSearch && matchesTech;
    });
  }, [initialProjects, searchQuery, selectedTech]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header Card */}
      <FadeIn>
        <section className="bg-card/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border-custom/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-foreground tracking-[0.2em] uppercase">
            <Laptop size={12} className="text-action" />
            ENGINEERING // PRODUCTION SYSTEMS & LABS
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-action">
            Portfolio & Systems Showcase
          </h1>
          <p className="text-accent text-xs leading-relaxed max-w-2xl">
            A curated index of production architectures, agentic AI frameworks, and full-stack applications built with modern tools and military systems discipline.
          </p>

          {/* Search & Tag Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-t border-border-custom/30">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
              <input
                type="text"
                placeholder="Search projects or technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 border border-border-custom rounded-xl pl-8 pr-4 py-2 text-xs text-foreground outline-none focus:border-action transition-all"
              />
            </div>

            {/* Clear Filters Indicator */}
            {(selectedTech || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTech(null);
                  setSearchQuery('');
                }}
                className="text-[9px] font-bold text-action uppercase tracking-widest hover:underline self-start sm:self-auto"
              >
                Clear Filters _
              </button>
            )}
          </div>

          {/* Tech Filter Pills */}
          {allTechTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent mr-1">
                Filter:
              </span>
              <button
                onClick={() => setSelectedTech(null)}
                className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md transition-all cursor-none border ${
                  selectedTech === null
                    ? 'bg-action text-background border-action'
                    : 'bg-card text-accent border-border-custom hover:border-action'
                }`}
              >
                All ({initialProjects.length})
              </button>
              {allTechTags.map((tech) => {
                const count = initialProjects.filter((p) => p.tech?.includes(tech)).length;
                return (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                    className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md transition-all cursor-none border ${
                      selectedTech === tech
                        ? 'bg-action text-background border-action'
                        : 'bg-card text-accent border-border-custom hover:border-action'
                    }`}
                  >
                    #{tech} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </FadeIn>

      {/* Projects Grid */}
      <StaggerContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const slug = project.slug || slugifyTitle(project.title);

          return (
            <StaggerItem key={project.id} className="h-full">
              <div className="group flex flex-col h-full border border-border-custom/30 rounded-2xl p-6 sm:p-7 bg-card/40 backdrop-blur-md hover:-translate-y-1 hover:border-action transition-all duration-300 shadow-sm justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <Link
                      href={`/portfolio/${slug}`}
                      className="group-hover:text-action transition-colors"
                    >
                      <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight hover:underline">
                        {project.title}
                      </h3>
                    </Link>
                    <Link
                      href={`/portfolio/${slug}`}
                      className="p-1 text-accent group-hover:text-action transition-colors"
                      aria-label={`View ${project.title} case study`}
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>

                  <p className="text-accent mb-6 text-xs leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-5 pt-4 border-t border-border-custom/20">
                  {/* Tech Dock */}
                  <div className="flex flex-wrap items-center -ml-2">
                    <TechIcon items={project.tech || []} />
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border-custom/20 text-[10px] font-mono">
                    <Link
                      href={`/portfolio/${slug}`}
                      className="font-bold text-action hover:underline transition-all tracking-widest uppercase flex items-center gap-1"
                    >
                      <BookOpen size={11} />
                      <span>Case Study &rarr;</span>
                    </Link>

                    <div className="flex items-center gap-4">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-accent hover:text-foreground transition-all tracking-widest uppercase flex items-center gap-1"
                        >
                          <ExternalLink size={10} />
                          <span>Demo _</span>
                        </a>
                      )}
                      {project.source_url && (
                        <a
                          href={project.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-accent hover:text-foreground transition-all tracking-widest uppercase flex items-center gap-1"
                        >
                          <FaGithub size={10} />
                          <span>Source _</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-20 text-xs text-accent uppercase tracking-widest italic opacity-50 bg-card/20 rounded-2xl border border-border-custom/20 p-8">
            No projects match the selected search or filter criteria.
          </div>
        )}
      </StaggerContainer>
    </main>
  );
}
