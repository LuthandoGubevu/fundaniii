
"use client"; // Convert to Client Component

import type { UserProfile, Story } from "@/lib/types";
import { db, auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StoryCard from "@/components/story/StoryCard";
import FollowButton from "@/components/profile/FollowButton";
import { Users, BookOpenCheck, Heart, ArrowLeft, Loader2, UserCircle } from "lucide-react";
import { useState, useEffect } from "react"; // Removed useTransition as it wasn't used
import { useToast } from "@/hooks/use-toast";

async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
     const createdAt = data.createdAt instanceof Timestamp 
                        ? data.createdAt.toDate().toISOString() 
                        : (typeof data.createdAt?.toDate === 'function' ? data.createdAt.toDate().toISOString() : new Date().toISOString());
    return { 
        uid: userSnap.id, 
        ...data,
        followersCount: data.followersCount || 0,
        followingCount: data.followingCount || 0,
        createdAt
      } as UserProfile;
  }
  return null;
}

async function getUserStories(uid: string): Promise<Story[]> {
  const storiesRef = collection(db, "stories");
  const q = query(storiesRef, where("authorId", "==", uid), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = data.createdAt instanceof Timestamp 
                      ? data.createdAt.toDate().toISOString() 
                      : (data.createdAt || new Date().toISOString());
    return { id: doc.id, ...data, createdAt } as Story;
  });
}


export default function ProfilePage() { // Removed params from props as we'll use the hook
  const clientParams = useParams();
  const pageUid = clientParams.uid as string; // Get uid from hook

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!pageUid) { // Check if pageUid (from hook) is available
        setIsLoading(false);
        return;
      }
      // The check for currentUser is now primarily for UI display decisions,
      // not for preventing the fetch if rules require auth.
      // If rules deny access, Firestore will throw an error handled below.

      setIsLoading(true);
      try {
        const userProfile = await getUserProfile(pageUid);
        if (!userProfile) {
          toast({ variant: "destructive", title: "Profile Not Found", description: "This user profile does not exist or you may not have permission to view it."});
          setProfile(null); 
          setStories([]);
          setIsLoading(false);
          // router.push('/explore'); // Optionally redirect
          return;
        }
        setProfile(userProfile);
        const userStories = await getUserStories(pageUid);
        setStories(userStories);
      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        let errorDesc = "Could not load profile. Please try again later.";
        if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("insufficient permissions"))) {
            errorDesc = "Failed to load profile due to Firestore permissions. Please ensure you are logged in if required by security rules, and that rules allow reading this profile.";
        } else if (error.message && error.message.toLowerCase().includes("failed to fetch")) {
             errorDesc = "Network error: Failed to fetch profile data. Please check your internet connection.";
        }
        toast({ variant: "destructive", title: "Profile Load Error", description: errorDesc, duration: 9000 });
        setProfile(null);
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Fetch data if pageUid is available and auth state has been resolved.
    if (pageUid && currentUser !== undefined) { 
        fetchData();
    } else if (!pageUid) {
        setIsLoading(false); // No UID from params, nothing to fetch
    }

  }, [pageUid, currentUser, toast, router]); // Use pageUid in dependency array

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser && !isLoading && pageUid) { 
    return (
      <div className="w-full max-w-md mx-auto p-4 md:p-6 lg:p-8 text-center">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80 p-8">
          <CardHeader>
             <UserCircle className="h-12 w-12 text-primary mx-auto mb-3" />
            <CardTitle className="text-2xl font-bold text-foreground">View Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg mb-4">Please sign in to view user profiles.</p>
            <Button asChild className="mt-4" size="lg">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!profile && !isLoading) {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 text-center">
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80 p-8">
                <CardHeader>
                    <UserCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-2xl font-bold text-destructive">Profile Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-lg mb-6">
                        The profile you are looking for does not exist or could not be loaded.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/explore">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  if (!profile) { 
    return <div className="text-center py-10"><p>Loading profile or profile not available.</p></div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <Button asChild variant="outline" size="sm" className="mb-6 bg-background/50">
        <Link href="/story-library">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Link>
      </Button>

      <Card className="shadow-xl bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <CardHeader className="items-center text-center p-6 md:p-8">
          <Image
            src={profile.avatarUrl || "https://placehold.co/150x150.png?text=Avatar"}
            alt={profile.displayName || profile.name || "User Avatar"}
            width={150}
            height={150}
            className="rounded-full border-4 border-primary-foreground shadow-lg object-cover mb-4"
            data-ai-hint="user avatar large"
          />
          <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">
            {profile.displayName || profile.name}
          </CardTitle>
          {profile.grade && profile.school && (
            <CardDescription className="text-lg text-muted-foreground">
              {profile.grade} @ {profile.school}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="border-t border-b border-border/30 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <BookOpenCheck className="h-8 w-8 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold text-foreground">{stories.length}</p>
              <p className="text-sm text-muted-foreground">Stories Shared</p>
            </div>
            <div>
              <Users className="h-8 w-8 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold text-foreground">{profile.followersCount || 0}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Heart className="h-8 w-8 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold text-foreground">{profile.followingCount || 0}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>
        </CardContent>
        <CardContent className="p-6 text-center">
          <FollowButton targetUserId={profile.uid} />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold text-primary-foreground mb-6">
          Stories by {profile.displayName || profile.name}
        </h2>
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {profile.displayName || profile.name} hasn't shared any stories yet.
          </p>
        )}
      </div>
    </div>
  );
}

