
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css"; // Adjust path to globals.css
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} antialiased font-sans bg-background text-foreground`}
      >
        {/* This layout does not include the animated background or the main sidebar */}
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
