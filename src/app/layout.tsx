
"use client"; 

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


const rootMetadata = {
  title: "Fundanii Ai",
  description: "AI-Powered Digital Storytelling & Learning Platform for African Learners",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/landing';


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        <title>{isLandingPage ? "Fundees - Turn Imagination into Stories!" : rootMetadata.title}</title>
        <meta name="description" content={isLandingPage ? "A fun, safe space where young learners create, share, and explore stories with the help of AI." : rootMetadata.description} />
      </head>
      <body
        className={`${GeistSans.variable} antialiased font-sans`}
      >
        {!isLandingPage && (
          
          <div
            className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #a1dff7 100%)' }}
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
        )}

        {isLandingPage ? (
          <>
            {children}
          </>
        ) : (
          
          <SidebarProvider defaultOpen={true}>
            <div className="relative flex min-h-screen"> 
              <Sidebar
                collapsible="icon"
                variant="sidebar"
                side="left"
                className="border-r bg-sidebar/80 backdrop-blur-sm supports-[backdrop-filter]:bg-sidebar/80"
              > 
                <AppSidebar /> 
              </Sidebar>
              <SidebarInset className="flex flex-col flex-1 overflow-y-auto"> 
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
                   <SidebarTrigger /> 
                </header>
                <main className="flex flex-1 flex-col items-center justify-center py-8 px-4">
                  {children}
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        )}
        <Toaster /> 
      </body>
    </html>
  );
}
