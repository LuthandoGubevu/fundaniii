
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css"; // Ensure this path is correct relative to this layout file
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Account - Fundanii Ai",
  description: "Sign in or create an account with Fundanii Ai.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // AuthLayout should NOT render its own <html> or <body> tags.
  // These are provided by the root layout (src/app/layout.tsx).
  // Apply auth-specific styling (like background, text color, font, and centering)
  // directly to the main wrapper element this layout provides.
  return (
    <main
      className={`${GeistSans.variable} font-sans antialiased bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4 md:p-6 lg:p-8`}
    >
      {/* The 'children' prop will render the content of /auth/signin/page.tsx or /auth/signup/page.tsx */}
      {children}
      <Toaster />
    </main>
  );
}
