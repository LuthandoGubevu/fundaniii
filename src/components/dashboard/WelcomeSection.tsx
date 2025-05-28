
"use client";

import type { UserProfile, Mood } from "@/lib/types";
import { dummyUserProfile, dummyMoods } from "@/lib/dummy-data";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Palette, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WelcomeSection() {
  const [user, setUser] = useState<UserProfile>(dummyUserProfile);
  const [currentMood, setCurrentMood] = useState<Mood>(user.mood || dummyMoods[0]);

  // Effect to simulate fetching user data if needed in future
  useEffect(() => {
    // For now, we just use dummy data
    setUser(dummyUserProfile);
    setCurrentMood(dummyUserProfile.mood || dummyMoods[0]);
  }, []);

  const handleMoodChange = (mood: Mood) => {
    setCurrentMood(mood);
    // Here you would typically save the mood to a backend or state management
    console.log("Mood changed to:", mood.label);
  };

  return (
    <Card className="shadow-lg bg-card/90 backdrop-blur-sm supports-[backdrop-filter]:bg-card/90 border border-primary/30 overflow-hidden">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <Image
            src={user.avatarUrl || "https://placehold.co/100x100.png?text=Avatar"}
            alt={user.name || "User Avatar"}
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-md object-cover"
            data-ai-hint="child avatar"
          />
          <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-primary/80 hover:bg-primary text-primary-foreground border-white">
            <Palette className="h-4 w-4" />
            <span className="sr-only">Edit Avatar</span>
          </Button>
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h2 className="text-3xl font-bold text-primary">
            Hi, {user.name}!
          </h2>
          <p className="text-muted-foreground text-lg">
            Ready for a new adventure today?
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-4xl p-2 h-auto hover:bg-accent/20">
              {currentMood.emoji}
              <span className="sr-only">Current mood: {currentMood.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm">
            {dummyMoods.map((mood) => (
              <DropdownMenuItem
                key={mood.label}
                onClick={() => handleMoodChange(mood)}
                className="text-2xl hover:bg-accent/10 cursor-pointer"
              >
                <span className="mr-2">{mood.emoji}</span>
                <span>{mood.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
