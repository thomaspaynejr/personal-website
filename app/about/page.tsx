import { ArrowUpRight } from 'lucide-react';
import { SiGithub, SiInstagram, SiLinkedin, SiX } from 'react-icons/si';
import TechIcon from '../components/TechIcon';
import { createClient } from '@/lib/supabase/server';

const socialIconMap: Record<string, React.ReactNode> = {
  linkedin: <SiLinkedin size={16} />,
  instagram: <SiInstagram size={16} />,
  github: <SiGithub size={16} />,
  x: <SiX size={16} />
};

export default async function About() {
  const supabase = await createClient();
  const { data: about } = await supabase!
    .from('about_content')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single();

  const bio_text = about?.bio_text || 'My path into technology is a blend of discipline, service, and continuous learning.';
  const journey_text = about?.journey_text || 'Following my military service, I pursued higher education...';
  const profile_image = about?.profile_image_url;
  const socials = about?.social_links || [
    { name: 'LinkedIn', href: '#', icon_type: 'linkedin' },
    { name: 'GitHub', href: '#', icon_type: 'github' }
  ];
  const experiences = about?.experience_json || [
    { title: 'Military Service', period: 'USA // 4Y', description: 'Logistics Specialist - Managed complex supply chains.' },
    { title: 'Desktop Support', period: 'CURRENT', description: 'Troubleshooting hardware/software issues.' }
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm">
        <h1 className="text-2xl font-bold">About Me</h1>
        <div className="mt-4 md:mt-0 flex gap-4">
          {socials.map((social: any) => (
            <a key={social.name} href={social.href} className="p-1.5 border border-border-custom rounded-lg text-foreground hover:text-action hover:border-action transition-all duration-300 bg-card/50" aria-label={social.name}>
              {socialIconMap[social.icon_type?.toLowerCase()] || socialIconMap.github}
            </a>
          ))}
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Bio Section with Hero Image */}
        <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 overflow-hidden">
          {profile_image && (
            <div className="mb-8 rounded-xl overflow-hidden border border-border-custom/50 aspect-[21/9] bg-background/50">
              <img 
                src={profile_image} 
                alt="Thomas Payne" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          )}
          <div className="text-[10px] font-bold text-action mb-3 tracking-tighter uppercase">01 // THE JOURNEY</div>
          <div className="text-accent max-w-none space-y-3">
            <p className="leading-relaxed text-sm whitespace-pre-wrap">
              {bio_text}
            </p>
            <p className="leading-relaxed text-sm whitespace-pre-wrap">
              {journey_text}
            </p>
          </div>
        </section>

        <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30">
          <div className="text-[10px] font-bold text-action mb-4 tracking-tighter uppercase">02 // EXPERIENCE</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((exp: any, idx: number) => (
              <div key={idx} className="border border-border-custom rounded-xl p-5 hover:border-accent transition-all duration-300 bg-background/30">
                <h3 className="font-bold text-sm mb-2 flex items-center justify-between">
                  <span>{exp.title}</span>
                  <ArrowUpRight size={12} className="text-accent" />
                </h3>
                <p className="text-[9px] text-accent mb-2 font-medium italic uppercase">{exp.period}</p>
                <p className="text-[11px] text-accent/80 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
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
