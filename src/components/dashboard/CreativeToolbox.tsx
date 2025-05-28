
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
  { name: "Add Illustrations", icon: ImageIconLucide, href: "/create-story?add=image", color: "bg-[#6C5CE7] hover:bg-[#584ABE]", description: "Bring it to life with art." },
];

export default function CreativeToolbox() {
  const { toast } = useToast();

  const handleToolClick = (href: string, name: string) => {
    if (name === "Translate Story" || name === "Start with Voice") {
      toast({
        title: "Coming Soon!",
        description: `${name} feature is under development.`,
        duration: 3000,
      });
      return false; 
    }
    return true; 
  };

  return (
    <Card className="shadow-lg bg-gradient-to-br from-[#2D9CDB] to-[#70C1B3] text-primary-foreground border-primary/50">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
           <Sparkles className="h-6 w-6 text-yellow-300" />
           <CardTitle className="text-xl font-semibold text-primary-foreground">Creative Toolbox</CardTitle>
        </div>
        <CardDescription className="text-primary-foreground/90">Supercharge your storytelling!</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {toolboxItems.map((item) => (
          <Button
            key={item.name}
            asChild={item.name !== "Translate Story" && item.name !== "Start with Voice"}
            variant="default"
            className={`flex flex-col items-center justify-center h-28 p-3 text-center text-primary-foreground shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${item.color}`}
            onClick={item.name === "Translate Story" || item.name === "Start with Voice" ? 
              (e) => { e.preventDefault(); handleToolClick(item.href, item.name); } : 
              undefined}
          >
            {item.name === "Translate Story" || item.name === "Start with Voice" ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <item.icon className="h-8 w-8 mb-1.5" />
                <span className="text-xs font-medium">{item.name}</span>
                <span className="text-[10px] opacity-80 mt-0.5">{item.description}</span>
              </div>
            ) : (
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
