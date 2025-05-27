
"use client";

import Link from "next/link";
import { BookHeart, Home, MessageCircleQuestion, PlusSquare, Library } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/create-story", label: "Start a Story", icon: PlusSquare },
  { href: "/ask-question", label: "Ask for Help", icon: MessageCircleQuestion },
  { href: "/story-library", label: "Story Library", icon: Library },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookHeart className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-primary">Fundanii Tales</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium",
                pathname === item.href
                  ? "text-primary bg-accent/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
