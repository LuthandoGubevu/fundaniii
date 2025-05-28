
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Wand2, Languages, Image as ImageIconLucide, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const toolboxItems = [
  { name: "Start with Voice", icon: Mic, href: "/create-story?mode=voice", color: "bg-primary hover:bg-primary/90", description: "Tell your story out loud!" },
  { name: "AI Story Builder", icon: Wand2, href: "/create-story?mode=ai", color: "bg-secondary hover:bg-secondary/90", description: "Get help from the AI." },
  { name: "Translate Story", icon: Languages, href: "/translate", color: "bg-accent hover:bg-accent/90", description: "Share in many tongues." },
  { name: "Add Illustrations", icon: ImageIconLucide, href: "/create-story?add=image", color: "bg-[#6C5CE7] hover:bg-[#584ABE]", description: "Bring it to life with art." }, // Purple from palette
];

export default function CreativeToolbox() {
  const { toast } = useToast();

  const handleToolClick = (href: string, name: string) => {
    if (name === "Translate Story" || name === "Start with Voice") { // Example for coming soon
      toast({
        title: "Coming Soon!",
        description: `${name} feature is under development.`,
        duration: 3000,
      });
      return false; // Prevent navigation for these items
    }
    return true; // Allow navigation for others
  };

  return (
    <Card className="shadow-lg bg-card/90 backdrop-blur-sm supports-[backdrop-filter]:bg-card/90 border-[#70C1B3]/50"> {/* Teal accent */}
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
           <Sparkles className="h-6 w-6 text-secondary" />
           <CardTitle className="text-xl font-semibold text-secondary-foreground">Creative Toolbox</CardTitle>
        </div>
        <CardDescription>Supercharge your storytelling!</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {toolboxItems.map((item) => (
          <Button
            key={item.name}
            asChild={item.name !== "Translate Story" && item.name !== "Start with Voice"} // Only use asChild if not "Coming Soon"
            variant="default"
            className={`flex flex-col items-center justify-center h-28 p-3 text-center text-primary-foreground shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${item.color}`}
            onClick={item.name === "Translate Story" || item.name === "Start with Voice" ? 
              (e) => { e.preventDefault(); handleToolClick(item.href, item.name); } : 
              undefined}
          >
            {item.name === "Translate Story" || item.name === "Start with Voice" ? (
              // Render as a div or button if it's a "Coming Soon" item
              <div className="flex flex-col items-center justify-center w-full h-full">
                <item.icon className="h-8 w-8 mb-1.5" />
                <span className="text-xs font-medium">{item.name}</span>
                <span className="text-[10px] opacity-80 mt-0.5">{item.description}</span>
              </div>
            ) : (
              // Render as a Link for other items
              <Link href={item.href} className="flex flex-col items-center justify-center w-full h-full">
                <item.icon className="h-8 w-8 mb-1.5" />
                <span className="text-xs font-medium">{item.name}</span>
                <span className="text-[10px] opacity-80 mt-0.5">{item.description}</span>
              </Link>
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
