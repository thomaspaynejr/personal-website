import { ArrowUpRight } from 'lucide-react';
import TechIcon from '../components/TechIcon';

export default function About() {
  const socials = [
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
      )
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
      )
    },
    {
      name: 'X',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
      )
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
      )
    }
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm">
        <h1 className="text-2xl font-bold">About Me</h1>
        <div className="mt-4 md:mt-0 flex gap-4">
          {socials.map((social) => (
            <a key={social.name} href={social.href} className="p-1.5 border border-border-custom rounded-lg hover:text-action hover:border-action transition-all duration-300 bg-background/50" aria-label={social.name}>
              {social.icon}
            </a>
          ))}
        </div>
      </div>
      
      <div className="space-y-8">
        <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30">
          <div className="text-[10px] font-bold text-action mb-3 tracking-tighter uppercase">01 // THE JOURNEY</div>
          <div className="text-accent max-w-none space-y-3">
            <p className="leading-relaxed text-sm">
              My path into technology is a blend of discipline, service, and continuous learning. 
              I served 4 years in the United States Army as a Logistics Specialist, where I 
              honed my problem-solving skills and learned the importance of detail and 
              resilience in high-pressure environments.
            </p>
            <p className="leading-relaxed text-sm">
              Following my military service, I pursued higher education at the University of 
              Southern Mississippi. Today, I work in Desktop Support, helping users solve 
              technical challenges while simultaneously diving deep into software development.
            </p>
          </div>
        </section>

        <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30">
          <div className="text-[10px] font-bold text-action mb-4 tracking-tighter uppercase">02 // EXPERIENCE</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border-custom rounded-xl p-5 hover:border-accent transition-all duration-300 bg-background/30">
              <h3 className="font-bold text-sm mb-2 flex items-center justify-between">
                <span>Military Service</span>
                <ArrowUpRight size={12} className="text-accent" />
              </h3>
              <p className="text-[9px] text-accent mb-2 font-medium italic uppercase">USA // 4Y</p>
              <p className="text-[11px] text-accent/80 leading-relaxed">
                Logistics Specialist - Managed complex supply chains and coordinated equipment 
                distribution with precision and accountability.
              </p>
            </div>
            <div className="border border-border-custom rounded-xl p-5 hover:border-accent transition-all duration-300 bg-background/30">
              <h3 className="font-bold text-sm mb-2 flex items-center justify-between">
                <span>Desktop Support</span>
                <ArrowUpRight size={12} className="text-accent" />
              </h3>
              <p className="text-[9px] text-accent mb-2 font-medium italic uppercase">CURRENT</p>
              <p className="text-[11px] text-accent/80 leading-relaxed">
                Troubleshooting hardware/software issues, managing active directory, and 
                ensuring smooth technical operations for end-users.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30">
          <div className="text-[10px] font-bold text-action mb-4 tracking-tighter uppercase">03 // TOOLKIT</div>
          <div className="flex flex-wrap items-center -ml-2">
            <TechIcon items={['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Supabase', 'Firebase']} />
          </div>
        </section>
      </div>
    </main>
  );
}
