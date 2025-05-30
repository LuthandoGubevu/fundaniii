
"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, PlusSquare, Library, Settings, LogOut, Brain, Compass } from "lucide-react"; // Added Compass
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/create-story", label: "Start a Story", icon: PlusSquare },
  { href: "/ask-question", label: "My Study Buddy", icon: Brain },
  { href: "/story-library", label: "Story Library", icon: Library },
  { href: "/explore", label: "Explore", icon: Compass }, // New Explore item
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      router.push("/auth/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "Could not sign out. Please try again.",
      });
    }
  };

  return (
    <>
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 p-2">
                <Image 
                  src="/logo.png" 
                  alt="Fundanii Ai Logo" 
                  width={32} 
                  height={32} 
                  className="text-primary"
                />
            </Link>
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
                     onClick={() => toast({ title: "Coming Soon!", description: "Settings page is under development."})}
                >
                    <Settings/>
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={handleSignOut}
                    tooltip={{ children: "Log Out", side: "right", align: "center" }}
                >
                    <LogOut />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
