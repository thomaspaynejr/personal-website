import Link from 'next/link';
import { Mail } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaGithub, FaLinkedin } from 'react-icons/fa6';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

const socialIconMap: Record<string, React.ReactNode> = {
  instagram: <FaInstagram size={18} />,
  x: <FaXTwitter size={18} />,
  twitter: <FaXTwitter size={18} />,
  github: <FaGithub size={18} />,
  linkedin: <FaLinkedin size={18} />
};

interface SocialLink {
  name: string;
  href: string;
  icon_type: string;
}

export default async function Footer() {
  const supabase = await createClient();
  const { data: about } = await supabase!
    .from('about_content')
    .select('social_links')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single();

  const dbSocials = about?.social_links as unknown as SocialLink[] | null;
  // Use DB socials if they exist and are not empty, otherwise use fallbacks
  const socials = (dbSocials && dbSocials.length > 0) ? dbSocials : [
    { name: 'Instagram', href: 'https://instagram.com', icon_type: 'instagram' },
    { name: 'X', href: 'https://x.com', icon_type: 'x' }
  ];

  return (
    <footer className="border-t border-border-custom mt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xs font-bold text-action tracking-tighter uppercase">Thomas Payne // 2024</span>
            <p className="text-accent text-[10px] font-medium">Built with Next.js, TypeScript & Tailwind CSS</p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/contact" className="flex items-center gap-2 text-xs font-medium hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group">
              <Mail size={14} className="group-hover:text-action transition-colors" />
              <span>CONTACT</span>
            </Link>
            
            <div className="h-4 w-px bg-border-custom" />

            <div className="flex gap-4">
              {socials.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-action transition-all duration-300 hover:-translate-y-0.5"
                  aria-label={social.name}
                >
                  {socialIconMap[social.icon_type?.toLowerCase()] || socialIconMap.x}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
