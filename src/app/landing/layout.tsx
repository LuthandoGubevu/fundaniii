
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css"; // Main global styles
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Fundees - Turn Imagination into Stories!",
  description: "A fun, safe space where young learners create, share, and explore stories with the help of AI.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} antialiased font-sans bg-white`}
      >
        {/* Animated Background Elements Container - Replicated from main layout */}
        <div
          className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #a1dff7 100%)' }} // Sky blue gradient
        >
          <div className="sun"></div>
          <div className="cloud one"></div>
          <div className="cloud two"></div>
          <div className="cloud three"></div>
          <div className="bird bird-one"></div>
          <div className="bird bird-two"></div>
          <div className="bird bird-three"></div>
          <div className="landscape">
            <div className="hill one"></div>
            <div className="hill two"></div>
            <div className="hill three"></div>
          </div>
        </div>

        <main className="relative z-10">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
