
"use client";

import type { Achievement } from "@/lib/types";
import { dummyAchievements } from "@/lib/dummy-data";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AchievementsPanel() {
  const [achievements, setAchievements] = useState<Achievement[]>(dummyAchievements);
  const [starsCollected, setStarsCollected] = useState(350); // Dummy star count

  return (
    <Card className="shadow-lg bg-card/90 backdrop-blur-sm supports-[backdrop-filter]:bg-card/90 border-[#B983FF]/50"> {/* Light Purple accent */}
      <CardHeader className="pb-3">
         <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-[#6C5CE7]" />
                <CardTitle className="text-xl font-semibold" style={{color: '#6C5CE7'}}>Your Awards</CardTitle>
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-[#FDCB6E]/80 text-yellow-900 font-semibold">
                <Star className="h-5 w-5 fill-current text-yellow-700" />
                <span>{starsCollected}</span>
            </div>
        </div>
        <CardDescription>Collect badges and shine bright!</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={100}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {achievements.map((ach) => (
              <Tooltip key={ach.id}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "p-3 rounded-lg flex flex-col items-center justify-center aspect-square border-2 transition-all duration-200",
                      ach.achieved
                        ? "bg-gradient-to-br from-[#FDCB6E] to-[#F8961E] border-[#F8961E]/80 shadow-lg transform scale-105"
                        : "bg-muted/40 border-dashed border-muted-foreground/50 opacity-60 hover:opacity-100 hover:border-muted-foreground"
                    )}
                  >
                    <ach.icon
                      className={cn(
                        "h-8 w-8 sm:h-10 sm:w-10",
                        ach.achieved ? "text-white" : "text-muted-foreground"
                      )}
                    />
                    {ach.achieved && (
                       <Star className="absolute -top-1 -right-1 h-4 w-4 fill-white text-yellow-400" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-popover/90 backdrop-blur text-center">
                  <p className="font-semibold">{ach.name}</p>
                  <p className="text-xs text-muted-foreground">{ach.description}</p>
                  {!ach.achieved && <p className="text-xs text-amber-600 italic mt-1">Keep going!</p>}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
