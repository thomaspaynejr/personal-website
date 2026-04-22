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

const mono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thomas Payne | Developer",
  description: "Personal Portfolio and Blog",
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
          
          {/* Background Effects (Middle Z-Index) */}
          <MatrixRain />
          <LightStrike />
        </Providers>
      </body>
    </html>
  );
}
