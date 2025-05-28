
"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, MessageCircleQuestion, PlusSquare, Library, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/create-story", label: "Start a Story", icon: PlusSquare },
  { href: "/ask-question", label: "Ask for Help", icon: MessageCircleQuestion },
  { href: "/story-library", label: "Story Library", icon: Library },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    // Sidebar component is part of SidebarProvider in layout.tsx
    // This component defines the content of the sidebar
    <>
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 p-2">
                <Image 
                  src="/logo.png" 
                  alt="Fundanii Ai Logo" 
                  width={32} 
                  height={32} 
                  className="text-primary" // Keep className in case of styling needs, though text-primary might not directly affect image
                />
                {/* Removed Fundanii Ai text span here */}
            </Link>
            {/* Desktop trigger - toggles between expanded and icon-only */}
            <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: "right", align: "center" }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    tooltip={{ children: "Settings", side: "right", align: "center" }}
                >
                    <Settings/>
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
