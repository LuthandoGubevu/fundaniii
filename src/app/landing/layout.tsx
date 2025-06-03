
import type { Metadata } from "next";
// GeistSans import might not be strictly necessary here if RootLayout handles global font variables
// import { GeistSans } from "geist/font/sans";
import "../globals.css"; // Main global styles

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
    <div className="relative min-h-screen"> {/* This div will be a child of RootLayout's body */}
      {/* Animated Background Elements Container - Specific to Landing Page */}
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

      {/* This main will hold the content of landing/page.tsx and its sections */}
      <main className="relative z-10">
        {children}
      </main>
      {/* Toaster is handled by RootLayout */}
    </div>
  );
}
