import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ScrollProgressBar from "./components/ScrollProgressBar";
import MatrixRain from "./components/MatrixRain";
import LightStrike from "./components/LightStrike";
import TerminalHUD from "./components/TerminalHUD";

const mono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://thomaspayne.dev'),
  title: {
    default: "Thomas Payne | Software Engineer & Systems Architect",
    template: "%s | Thomas Payne"
  },
  description: "Personal platform, technical essays, and production engineering portfolio of Thomas Payne. Built on Next.js 16, React 19, Supabase SSR, and monochromatic obsidian minimalism.",
  keywords: [
    "Thomas Payne",
    "Software Engineer",
    "Systems Architect",
    "Next.js 16",
    "React 19",
    "Turbopack",
    "TypeScript",
    "Supabase",
    "Tailwind CSS 4",
    "Framer Motion",
    "Military Veteran"
  ],
  authors: [{ name: "Thomas Payne", url: "https://thomaspayne.dev" }],
  creator: "Thomas Payne",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Thomas Payne // Developer HUD",
    title: "Thomas Payne | Software Engineer & Systems Architect",
    description: "Personal platform, technical essays, and production engineering portfolio of Thomas Payne.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thomas Payne // Developer HUD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thomas Payne | Software Engineer & Systems Architect",
    description: "Personal platform, technical essays, and production engineering portfolio of Thomas Payne.",
    creator: "@thomaspaynejr",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mono.className} transition-colors duration-300 cursor-none overflow-x-hidden`}>
        <Providers>
          {/* Main Content (Highest Z-Index) */}
          <div className="relative z-20 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>

          {/* UI Overlays */}
          <ScrollProgressBar />
          <CustomCursor />
          <TerminalHUD />
          
          {/* Background Effects (Middle Z-Index) */}
          <MatrixRain />
          <LightStrike />
        </Providers>
      </body>
    </html>
  );
}
