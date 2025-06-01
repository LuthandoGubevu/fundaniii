
"use client";

import type { UserProfile } from "@/lib/types";
// dummyUserProfile is not directly used for display fallback anymore to avoid showing "Lerato"
// import { dummyUserProfile } from "@/lib/dummy-data"; 
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { auth, db } from "@/lib/firebase";
import type { User as FirebaseUserType } from "firebase/auth"; // Renamed to avoid conflict with Lucide User icon
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore"; // Removed getDoc as onSnapshot is used
import { Heart, Users, Loader2, User as UserIcon } from "lucide-react"; // UserIcon from Lucide
import { useToast } from "@/hooks/use-toast";

export default function WelcomeSection() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUserType | null>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoadingProfile(true);
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const fetchedProfile = docSnap.data() as UserProfile;
            setUserProfile({
              uid: currentUser.uid, // Ensure UID is always from currentUser
              name: fetchedProfile.name || currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0] || "Learner",
              surname: fetchedProfile.surname || currentUser.displayName?.split(' ')[1] || "",
              displayName: fetchedProfile.displayName || currentUser.displayName || `${fetchedProfile.name || currentUser.displayName?.split(' ')[0] || "Learner"} ${fetchedProfile.surname || currentUser.displayName?.split(' ')[1] || ""}`.trim(),
              avatarUrl: fetchedProfile.avatarUrl || currentUser.photoURL || `https://placehold.co/100x100.png?text=${(fetchedProfile.name || currentUser.displayName?.split(' ')[0] || "L").charAt(0)}`,
              followersCount: fetchedProfile.followersCount || 0,
              followingCount: fetchedProfile.followingCount || 0,
              school: fetchedProfile.school,
              grade: fetchedProfile.grade,
              mood: fetchedProfile.mood,
              createdAt: fetchedProfile.createdAt,
            });
          } else {
            // User document doesn't exist in Firestore, create a basic profile from auth data
            console.warn(`User document for UID ${currentUser.uid} not found in Firestore. Displaying basic profile from auth details.`);
            setUserProfile({
              uid: currentUser.uid,
              name: currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0] || "Learner",
              surname: currentUser.displayName?.split(' ')[1] || "",
              displayName: currentUser.displayName || `${currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0] || "Learner"} ${currentUser.displayName?.split(' ')[1] || ""}`.trim(),
              avatarUrl: currentUser.photoURL || `https://placehold.co/100x100.png?text=${(currentUser.displayName?.split(' ')[0] || "L").charAt(0)}`,
              followersCount: 0,
              followingCount: 0,
            });
          }
          setIsLoadingProfile(false);
        }, (error: any) => {
            console.error("Error fetching user profile from Firestore:", error);
            let errorDesc = "Could not load your profile. Please try again later.";
            if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("insufficient permissions"))) {
              errorDesc = "Failed to load profile due to Firestore permissions. Please check your Firestore Security Rules for reading your own user document.";
            }
            toast({ variant: "destructive", title: "Profile Load Error", description: errorDesc, duration: 7000 });
            setUserProfile(null); // Set to null on error
            setIsLoadingProfile(false);
        });
        return () => unsubscribeProfile();
      } else {
        setUserProfile(null);
        setTotalLikes(0);
        setIsLoadingProfile(false);
        setIsLoadingStats(false); 
      }
    });
    return () => unsubscribeAuth();
  }, [toast]);

  useEffect(() => {
    if (firebaseUser) {
      setIsLoadingStats(true);
      const storiesRef = collection(db, "stories");
      const q = query(storiesRef, where("authorId", "==", firebaseUser.uid));

      const unsubscribeLikes = onSnapshot(q, (querySnapshot) => {
        let likesSum = 0;
        querySnapshot.forEach((doc) => {
          likesSum += (doc.data().upvotes || 0);
        });
        setTotalLikes(likesSum);
        setIsLoadingStats(false);
      }, (error: any) => {
        console.error("Error fetching user stories for likes:", error);
        let errorDesc = "Could not load your story stats. Please try again later.";
        if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("insufficient permissions"))) {
          errorDesc = "Failed to load story stats due to Firestore permissions. Please check security rules for reading your stories.";
        }
        toast({ variant: "destructive", title: "Stats Load Error", description: errorDesc, duration: 7000 });
        setTotalLikes(0);
        setIsLoadingStats(false);
      });
      return () => unsubscribeLikes();
    } else {
      setTotalLikes(0);
      setIsLoadingStats(false);
    }
  }, [firebaseUser, toast]);

  return (
    <Card className="shadow-lg bg-gradient-to-br from-[#2D9CDB] to-[#70C1B3] text-primary-foreground border-primary/50 overflow-hidden">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative flex-shrink-0">
          {isLoadingProfile ? (
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" />
            </div>
          ) : userProfile && userProfile.avatarUrl ? (
            <Image
              src={userProfile.avatarUrl}
              alt={userProfile.displayName || userProfile.name || "User Avatar"}
              width={100}
              height={100}
              className="rounded-full border-4 border-white shadow-md object-cover"
              data-ai-hint="child avatar"
            />
          ) : (
             <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-md">
              <UserIcon className="h-12 w-12 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex-grow text-center sm:text-left">
          {isLoadingProfile ? (
            <h2 className="text-3xl font-bold text-primary-foreground">Loading...</h2>
          ) : userProfile ? (
            <h2 className="text-3xl font-bold text-primary-foreground">
              Hi, {userProfile.displayName || userProfile.name}!
            </h2>
          ) : firebaseUser ? ( 
            <h2 className="text-3xl font-bold text-primary-foreground">Welcome!</h2>
          ) : ( 
            <h2 className="text-3xl font-bold text-primary-foreground">Welcome to Fundanii!</h2>
          )}
          <p className="text-lg text-primary-foreground/90">
            Ready for a new adventure today?
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end space-y-2">
          {isLoadingStats || isLoadingProfile ? (
            <div className="h-16 flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
            </div>
          ) : firebaseUser && userProfile ? (
            <>
              <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/20 text-primary-foreground font-bold text-lg">
                  <Heart className="h-6 w-6 fill-red-500 text-red-500" />
                  <span>{totalLikes} Likes</span>
              </div>
              <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/20 text-primary-foreground font-bold text-lg">
                  <Users className="h-6 w-6 text-blue-300" />
                  <span>{userProfile.followersCount || 0} Followers</span>
              </div>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
