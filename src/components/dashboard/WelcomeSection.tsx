
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
import { Heart, Users } from "lucide-react";

export default function WelcomeSection() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const fetchedProfile = docSnap.data() as UserProfile;
            setUserProfile({
              ...dummyUserProfile, // Start with dummy for defaults
              ...fetchedProfile,   // Override with fetched data
              uid: currentUser.uid,
              name: fetchedProfile.name || currentUser.displayName || currentUser.email?.split('@')[0] || "Learner",
              displayName: fetchedProfile.displayName || currentUser.displayName || `${fetchedProfile.name} ${fetchedProfile.surname}` || "Learner",
              avatarUrl: fetchedProfile.avatarUrl || currentUser.photoURL || `https://placehold.co/100x100.png?text=${(fetchedProfile.name || "L").charAt(0)}`,
            });
          } else {
            // Fallback if Firestore profile doesn't exist yet (should be rare with current signup)
            setUserProfile({
              ...dummyUserProfile,
              uid: currentUser.uid,
              name: currentUser.displayName || currentUser.email?.split('@')[0] || "Learner",
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || "Learner",
              avatarUrl: currentUser.photoURL || `https://placehold.co/100x100.png?text=${(currentUser.displayName || "L").charAt(0)}`,
              followersCount: 0,
              followingCount: 0,
            });
          }
        }, (error) => {
            console.error("Error fetching user profile from Firestore:", error);
            setUserProfile({
                ...dummyUserProfile,
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email?.split('@')[0] || "Learner",
                displayName: currentUser.displayName || currentUser.email?.split('@')[0] || "Learner",
                avatarUrl: currentUser.photoURL || `https://placehold.co/100x100.png?text=${(currentUser.displayName || "L").charAt(0)}`,
                followersCount: 0,
                followingCount: 0,
            });
        });
        return () => unsubscribeProfile();

      } else {
        setUserProfile(null); // Set to null when no user
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

  const profileToDisplay = userProfile || dummyUserProfile; // Use dummy if userProfile is null

  return (
    <Card className="shadow-lg bg-gradient-to-br from-[#2D9CDB] to-[#70C1B3] text-primary-foreground border-primary/50 overflow-hidden">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <Image
            src={profileToDisplay.avatarUrl || "https://placehold.co/100x100.png?text=User"}
            alt={profileToDisplay.displayName || profileToDisplay.name || "User Avatar"}
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-md object-cover"
            data-ai-hint="child avatar"
          />
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Hi, {profileToDisplay.displayName || profileToDisplay.name}!
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
                    <Users className="h-6 w-6 text-blue-300" />
                    <span>{profileToDisplay.followersCount || 0} Followers</span>
                </div>
             </div>
        </div>
      </CardContent>
    </Card>
  );
}
