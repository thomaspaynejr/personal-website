import TechIcon from "../components/TechIcon";
import { createClient } from '@/lib/supabase/server';

export default async function Portfolio() {
  const supabase = await createClient();
  const { data: projects } = await supabase!
    .from('portfolio_projects')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">Portfolio</h1>
        <p className="text-accent text-sm max-w-2xl leading-relaxed">
          A selection of projects where I apply my technical skills to solve
          problems and explore new technologies.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project: any, index: number) => (
          <div
            key={project.id}
            className="group flex flex-col border border-border-custom/30 rounded-2xl p-6 bg-card/40 backdrop-blur-md hover:-translate-y-1 hover:border-action transition-all duration-300 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-3 group-hover:text-action transition uppercase tracking-tight">
              {project.title}
            </h3>
            <p className="text-accent mb-6 text-xs flex-grow leading-relaxed">
              {project.description}
            </p>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center -ml-2">
                <TechIcon items={project.tech || []} />
              </div>
              <div className="flex gap-6 pt-4 border-t border-border-custom/30">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    className="text-[10px] font-bold text-action hover:underline transition-all tracking-widest uppercase"
                  >
                    Demo _
                  </a>
                )}
                {project.source_url && (
                  <a
                    href={project.source_url}
                    className="text-[10px] font-bold text-accent hover:text-foreground transition-all tracking-widest uppercase"
                  >
                    Source _
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {!projects?.length && (
          <p className="col-span-full text-center py-20 text-xs text-accent uppercase tracking-widest italic opacity-50">
            No projects published yet.
          </p>
        )}
      </div>
    </main>
  );
}
