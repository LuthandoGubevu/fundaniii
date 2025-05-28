
"use client";

import type { UserProfile } from "@/lib/types";
import { dummyUserProfile } from "@/lib/dummy-data";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { auth, db } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { Heart, Users } from "lucide-react"; // Added Users icon

export default function WelcomeSection() {
  const [userProfile, setUserProfile] = useState<UserProfile>(dummyUserProfile);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  // No need to store followersCount separately, it will be part of userProfile

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        // Fetch user profile from Firestore to get followersCount and other details
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const fetchedProfile = docSnap.data() as UserProfile;
            setUserProfile({
              ...dummyUserProfile, // Start with dummy to ensure all fields are present
              ...fetchedProfile,   // Override with fetched data
              name: currentUser.displayName || fetchedProfile.name || currentUser.email?.split('@')[0] || "Storyteller",
              avatarUrl: currentUser.photoURL || fetchedProfile.avatarUrl || `https://placehold.co/100x100.png?text=${(currentUser.displayName || fetchedProfile.name || "S").charAt(0)}`,
            });
          } else {
            // User exists in Auth but not in Firestore users collection (should not happen with current signup flow)
            setUserProfile({
              ...dummyUserProfile,
              name: currentUser.displayName || currentUser.email?.split('@')[0] || "Storyteller",
              avatarUrl: currentUser.photoURL || `https://placehold.co/100x100.png?text=${(currentUser.displayName || "S").charAt(0)}`,
              followersCount: 0, // Default
            });
          }
        }, (error) => {
            console.error("Error fetching user profile from Firestore:", error);
            // Fallback if Firestore profile fetch fails
            setUserProfile({
                ...dummyUserProfile,
                name: currentUser.displayName || currentUser.email?.split('@')[0] || "Storyteller",
                avatarUrl: currentUser.photoURL || `https://placehold.co/100x100.png?text=${(currentUser.displayName || "S").charAt(0)}`,
            });
        });
        return () => unsubscribeProfile();

      } else {
        setUserProfile(dummyUserProfile);
        setTotalLikes(0);
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
        setTotalLikes(0);
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
            src={userProfile.avatarUrl || "https://placehold.co/100x100.png?text=Avatar"}
            alt={userProfile.name || "User Avatar"}
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-md object-cover"
            data-ai-hint="child avatar"
          />
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Hi, {userProfile.name}!
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Ready for a new adventure today?
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end space-y-2">
             <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/20 text-primary-foreground font-bold text-lg">
                    <Heart className="h-6 w-6 fill-red-500 text-red-500" />
                    <span>{totalLikes} Likes</span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/20 text-primary-foreground font-bold text-lg">
                    <Users className="h-6 w-6 text-blue-300" /> {/* Changed icon color for differentiation */}
                    <span>{userProfile.followersCount || 0} Followers</span>
                </div>
             </div>
        </div>
      </CardContent>
    </Card>
  );
}
