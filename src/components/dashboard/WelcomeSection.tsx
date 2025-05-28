
"use client";

import type { UserProfile } from "@/lib/types";
import { dummyUserProfile } from "@/lib/dummy-data";
import { useState, useEffect } from "react";
import Image from "next/image";
// Button and DropdownMenu imports removed as they are no longer used for mood
import { Card, CardContent } from "@/components/ui/card";
import { auth, db } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Removed sum, as we'll sum manually
import { Heart } from "lucide-react";

export default function WelcomeSection() {
  const [user, setUser] = useState<UserProfile>(dummyUserProfile);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        setUser((prevUser) => ({
          ...prevUser,
          name: currentUser.displayName || currentUser.email?.split('@')[0] || "Storyteller",
          avatarUrl: currentUser.photoURL || prevUser.avatarUrl,
        }));
      } else {
        setUser(dummyUserProfile);
        setTotalLikes(0); // Reset likes if user logs out
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      const storiesRef = collection(db, "stories");
      const q = query(storiesRef, where("authorId", "==", firebaseUser.uid));

      const unsubscribeLikes = onSnapshot(q, (querySnapshot) => {
        let likesSum = 0;
        querySnapshot.forEach((doc) => {
          likesSum += (doc.data().upvotes || 0);
        });
        setTotalLikes(likesSum);
      }, (error) => {
        console.error("Error fetching user stories for likes:", error);
        setTotalLikes(0); // Reset on error
      });
      return () => unsubscribeLikes();
    } else {
      setTotalLikes(0);
    }
  }, [firebaseUser]);

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
        <div className="flex flex-col items-center sm:items-end space-y-2">
            {/* Mood emoji DropdownMenu removed */}
             <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 text-primary-foreground font-bold text-xl">
                <Heart className="h-7 w-7 fill-red-500 text-red-500" />
                <span>{totalLikes} Likes</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
