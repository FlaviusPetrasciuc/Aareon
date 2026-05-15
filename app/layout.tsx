import type { Metadata } from "next";
import { Playfair_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core";
import Link from "next/link";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  style: ["italic", "normal"],
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const mono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Aareon Recruiter Intake Agent",
  description: "AI-powered intake interviews for hiring managers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${mono.variable}`}>
      <body className="bg-aareon-sand font-body text-aareon-body antialiased">
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link 
                  href="/" 
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 border-b-2 border-blue-600"
                >
                  Create Job Posting
                </Link>
                <Link 
                  href="/ai-recruiter" 
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                >
                  AI Recruiter Assistant
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <CopilotKit runtimeUrl="/api/copilotkit">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}