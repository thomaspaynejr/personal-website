import TechIcon from '../components/TechIcon';

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
    tech: ["React", "Firebase"],
    link: "#",
    github: "#"
  }
];

export default function Portfolio() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">Portfolio</h1>
        <p className="text-accent text-sm max-w-2xl leading-relaxed">
          A selection of projects where I apply my technical skills to solve problems and explore new technologies.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="group flex flex-col border border-border-custom/30 rounded-2xl p-6 bg-card/40 backdrop-blur-md hover:-translate-y-1 hover:border-action transition-all duration-300 shadow-sm">
            <h3 className="text-lg font-bold mb-3 group-hover:text-action transition uppercase tracking-tight">{project.title}</h3>
            <p className="text-accent mb-6 text-xs flex-grow leading-relaxed">
              {project.description}
            </p>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center -ml-2">
                <TechIcon items={project.tech} />
              </div>
              <div className="flex gap-6 pt-4 border-t border-border-custom/30">
                <a href={project.link} className="text-[10px] font-bold text-action hover:underline transition-all tracking-widest uppercase">Demo _</a>
                <a href={project.github} className="text-[10px] font-bold text-accent hover:text-foreground transition-all tracking-widest uppercase">Source _</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}