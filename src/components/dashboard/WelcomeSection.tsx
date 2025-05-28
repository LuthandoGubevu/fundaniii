
"use client";

import type { UserProfile, Mood } from "@/lib/types";
import { dummyUserProfile, dummyMoods } from "@/lib/dummy-data";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export default function WelcomeSection() {
  const [user, setUser] = useState<UserProfile>(dummyUserProfile);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [currentMood, setCurrentMood] = useState<Mood>(user.mood || dummyMoods[0]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        setUser((prevUser) => ({
          ...prevUser,
          name: currentUser.displayName || currentUser.email || "Storyteller",
          avatarUrl: currentUser.photoURL || prevUser.avatarUrl,
        }));
      } else {
        setUser(dummyUserProfile);
        setCurrentMood(dummyUserProfile.mood || dummyMoods[0]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCurrentMood(user.mood || dummyMoods[0]);
  }, [user.mood]);

  const handleMoodChange = (mood: Mood) => {
    setCurrentMood(mood);
    console.log("Mood changed to:", mood.label);
  };

  return (
    <Card className="shadow-lg bg-gradient-to-br from-[#2D9CDB] to-[#70C1B3] text-primary-foreground border-primary/50 overflow-hidden">
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
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Hi, {user.name}!
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Ready for a new adventure today?
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-4xl p-2 h-auto hover:bg-white/20 focus-visible:ring-white/50">
              {currentMood.emoji}
              <span className="sr-only">Current mood: {currentMood.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm text-popover-foreground">
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
