interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
}

const projects: Project[] = [
  {
    title: "Personal Portfolio",
    description: "A minimalistic, responsive personal website built with Next.js and Tailwind CSS. Features dark mode and a clean aesthetic.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    link: "/",
    github: "#"
  },
  {
    title: "Inventory Management Tracker",
    description: "A tool designed for efficient tracking of assets and equipment, inspired by military logistics principles.",
    tech: ["Next.js", "Supabase", "Tailwind"],
    link: "#",
    github: "#"
  },
  {
    title: "Support Ticket Dashboard",
    description: "A concept for a streamlined desktop support ticketing system to manage user requests and technical issues.",
    tech: ["React", "Firebase", "CSS Modules"],
    link: "#",
    github: "#"
  }
];

export default function Portfolio() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
      <p className="text-accent mb-12 text-lg max-w-2xl">
        A selection of projects where I apply my technical skills to solve problems and explore new technologies.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div key={index} className="group flex flex-col border border-border-custom rounded-2xl p-6 hover:-translate-y-2 hover:border-action transition-all duration-300">
            <h3 className="text-xl font-bold mb-2 group-hover:text-action transition">{project.title}</h3>
            <p className="text-accent mb-6 text-sm flex-grow leading-relaxed">
              {project.description}
            </p>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 bg-border-custom/30 text-[10px] font-bold uppercase tracking-wider rounded text-accent">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-6 pt-2 border-t border-border-custom">
                <a href={project.link} className="text-sm font-bold text-action hover:underline transition-colors">Demo</a>
                <a href={project.github} className="text-sm font-bold text-accent hover:text-foreground transition-colors">Source</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}