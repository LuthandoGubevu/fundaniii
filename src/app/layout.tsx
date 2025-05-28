
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";


export const metadata: Metadata = {
  title: "Fundanii Ai",
  description: "AI-Powered Digital Storytelling & Learning Platform for African Learners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} antialiased font-sans`}
      >
        {/* Animated Background Elements Container */}
        {/* This container now has the sky gradient background */}
        <div
          className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #a1dff7 100%)' }}
        >
          <div className="sun"></div>
          <div className="cloud one"></div>
          <div className="cloud two"></div>
          <div className="cloud three"></div>
          <div className="landscape">
            <div className="mountain distant"></div>
            <div className="mountain mid"></div>
            <div className="hill one"></div>
            <div className="hill two"></div>
            <div className="hill three"></div>
          </div>
        </div>

        <SidebarProvider defaultOpen={true}>
          <div className="relative flex min-h-screen"> {/* Main flex container for sidebar and content */}
            <Sidebar
              collapsible="icon"
              variant="sidebar"
              side="left"
              className="border-r bg-sidebar/80 backdrop-blur-sm supports-[backdrop-filter]:bg-sidebar/80"
            > {/* Sidebar definition */}
              <AppSidebar /> {/* Sidebar content from the new component */}
            </Sidebar>
            <SidebarInset className="flex flex-col flex-1 overflow-y-auto"> {/* Manages content area beside sidebar */}
              {/* Mobile Header with Sidebar Trigger */}
              <header className="sticky top-0 z-40 md:hidden flex items-center justify-between border-b bg-background/30 backdrop-blur supports-[backdrop-filter]:bg-background/20 p-4 h-16">
                 <Link href="/" className="flex items-center space-x-2">
                    <Image
                      src="/logo.png"
                      alt="Fundanii Ai Logo"
                      width={32}
                      height={32}
                      className="text-primary"
                    />
                 </Link>
                 <SidebarTrigger /> {/* Mobile trigger */}
              </header>
              {/* Main content area. flex-1 makes it take remaining vertical space. items-center centers children horizontally. justify-center centers children vertically. */}
              <main className="flex flex-1 flex-col items-center justify-center py-8 px-4">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
