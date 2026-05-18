import type { Metadata } from "next";
import { Playfair_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core";
<<<<<<< HEAD
=======
import Link from "next/link";
>>>>>>> 28cc8d440fea27fb842f2761be544d5f3ddba4b8
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
<<<<<<< HEAD
      <body className="bg-aareon-sand font-body text-aareon-body antialiased">
=======
      <body className="bg-aareon-sand font-body text-aareon-body antialiased">  
>>>>>>> 28cc8d440fea27fb842f2761be544d5f3ddba4b8
        <CopilotKit runtimeUrl="/api/copilotkit">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 28cc8d440fea27fb842f2761be544d5f3ddba4b8
