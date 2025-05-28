
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusSquare, MessageCircleQuestion, Library, BookOpen, Pencil, Palette } from "lucide-react";
import Link from "next/link";

const shortcuts = [
  { title: "Create a New Story", description: "Let your imagination run wild!", icon: Pencil, href: "/create-story", bgColor: "bg-[#6EA719]", textColor:"text-white" },
  { title: "Ask for Help", description: "Get answers to your questions.", icon: MessageCircleQuestion, href: "/ask-question", bgColor: "bg-[#FFC60B]", textColor:"text-black" },
  { title: "Explore Story Library", description: "Discover amazing adventures.", icon: Library, href: "/story-library", bgColor: "bg-[#A8218E]", textColor:"text-white" },
];

export default function NavigationShortcuts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {shortcuts.map((shortcut) => (
        <Card
          key={shortcut.title}
          style={{ backgroundColor: shortcut.bgColor.replace('bg-', '') }} // Use style for direct hex, remove Tailwind bg class
          className={`shadow-xl flex flex-col ${shortcut.textColor} bg-card/90 backdrop-blur-sm supports-[backdrop-filter]:bg-card/90`}
        >
          <CardHeader className="items-center text-center pb-3">
            <shortcut.icon className={`w-10 h-10 mb-2 ${shortcut.textColor}`} />
            <CardTitle className={`text-xl font-semibold ${shortcut.textColor}`}>{shortcut.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow text-center">
            <CardDescription className={`pt-1 min-h-[2.5em] ${shortcut.textColor === 'text-white' ? 'text-white/90' : 'text-black/80'}`}>
              {shortcut.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="p-4">
            <Button
              asChild
              size="lg"
              className={`shadow-md hover:shadow-lg transition-shadow w-full mt-auto 
                          ${shortcut.textColor === 'text-white' ? 'bg-white text-black hover:bg-gray-200' 
                                                                 : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
            >
              <Link href={shortcut.href}>
                Go Now
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
