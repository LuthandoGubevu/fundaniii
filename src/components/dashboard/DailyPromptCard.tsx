
"use client";

import type { DailyPrompt } from "@/lib/types";
import { dummyDailyPrompt } from "@/lib/dummy-data";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Wand2 } from "lucide-react";
import Link from "next/link";

export default function DailyPromptCard() {
  const [prompt, setPrompt] = useState<DailyPrompt>(dummyDailyPrompt);

  useEffect(() => {
    // In a real app, you might fetch a new prompt daily
    setPrompt(dummyDailyPrompt);
  }, []);

  return (
    <Card className="shadow-lg bg-gradient-to-br from-[#2D9CDB] to-[#70C1B3] text-primary-foreground border-primary/50">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <div className="p-2 rounded-full bg-white/20"> {/* Adjusted icon background for better contrast */}
          <Lightbulb className="h-6 w-6 text-yellow-300" /> {/* Icon color kept for emphasis */}
        </div>
        <div>
          <CardTitle className="text-xl font-semibold" style={{color: '#FDCB6E'}}>Spark Your Imagination!</CardTitle> {/* Kept specific color for emphasis */}
          <CardDescription className="text-sm">Today's writing challenge</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg">
          "{prompt.text}"
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-gradient-to-r from-[#F8961E] to-[#FDCB6E] text-white hover:opacity-90 transition-opacity">
          <Link href={`/create-story?prompt=${encodeURIComponent(prompt.text)}`}>
            <Wand2 className="mr-2 h-5 w-5" /> Start Story with this Idea
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
