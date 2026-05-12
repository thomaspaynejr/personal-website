import Link from 'next/link';
import { Mail } from 'lucide-react';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const socials = [
    {
      name: 'Instagram',
      href: '#',
      icon: <FaInstagram size={18} />
    },
    {
      name: 'X',
      href: '#',
      icon: <FaXTwitter size={18} />
    }
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
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
