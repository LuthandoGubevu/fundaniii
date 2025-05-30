
"use client";

import type { UserProfile, Story } from "@/lib/types";
import { db, auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { useRouter, useParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StoryCard from "@/components/story/StoryCard";
import FollowButton from "@/components/profile/FollowButton";
import { Users, BookOpenCheck, Heart, ArrowLeft, Loader2, UserCircle, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChanged } from "firebase/auth";

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
  const q = query(storiesRef, where("authorId", "==", uid), where("status", "==", "Published"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt || new Date().toISOString());
    return { id: doc.id, ...data, createdAt, upvotes: data.upvotes || 0, likedBy: data.likedBy || [] } as Story;
  });
}


export default function ProfilePage() {
  const clientParams = useParams();
  const pageUid = clientParams.uid as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user && pageUid) { // If trying to view a profile but not logged in
         // No automatic redirect, just set loading to false and let UI handle "please sign in"
         setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [pageUid]);

  useEffect(() => {
    async function fetchData() {
      if (!pageUid) {
        setIsLoading(false);
        return;
      }
      
      // Only fetch if a user is logged in, as per security rules allow read: if request.auth != null;
      if (!currentUser) {
        setIsLoading(false); // Stop loading if no current user to attempt the fetch
        return;
      }

      setIsLoading(true);
      try {
        const userProfile = await getUserProfile(pageUid);
        if (!userProfile) {
          toast({ variant: "destructive", title: "Profile Not Found", description: "This user profile does not exist." });
          setProfile(null);
          setStories([]);
          setIsLoading(false);
          return;
        }
        setProfile(userProfile);
        const userStories = await getUserStories(pageUid);
        setStories(userStories);
      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        let errorDesc = "Could not load profile. Please try again later.";
        if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("insufficient permissions"))) {
          errorDesc = "Failed to load profile due to Firestore permissions. Ensure you are logged in and check Firestore Security Rules allow reading user profiles.";
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
    
    if (pageUid && currentUser !== undefined) { // Ensure auth state is resolved before fetching
        if (currentUser) { // User is logged in, proceed to fetch
            fetchData();
        } else { // User is not logged in
            setIsLoading(false); // Don't show loader if we know user is not logged in
        }
    }

  }, [pageUid, currentUser, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser && !isLoading && pageUid) { // User is not logged in and loading is complete
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
  
  if (!profile && !isLoading) { // Profile doesn't exist after attempting to fetch
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 text-center">
        <Card className="shadow-xl bg-gradient-to-br from-destructive/80 to-destructive/60 text-destructive-foreground border-destructive/50 p-8">
          <CardHeader>
            <UserCircle className="h-16 w-16 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">
              The profile you are looking for does not exist or could not be loaded.
            </p>
            <Button asChild variant="outline" className="bg-background/50 hover:bg-accent/10 text-foreground">
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
     // This case should ideally be caught by the !profile && !isLoading block above
    return <div className="text-center py-10"><p>Profile data is not available.</p></div>;
  }

  const avatarText = profile.name && profile.surname 
    ? `${profile.name.charAt(0)}${profile.surname.charAt(0)}` 
    : (profile.displayName || "U").charAt(0);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <Button asChild variant="outline" size="sm" className="mb-6 bg-background/50 hover:bg-accent/10">
        <Link href="/explore">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Explore
        </Link>
      </Button>

      <Card className="shadow-xl bg-gradient-to-br from-[#2D9CDB] to-[#70C1B3] text-primary-foreground border-primary/50 overflow-hidden">
        <CardHeader className="items-center text-center p-6 md:p-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.displayName || profile.name || "User Avatar"}
                fill
                className="rounded-full border-4 border-white shadow-lg object-cover"
                data-ai-hint="user avatar large"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary-foreground/20 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-4xl md:text-5xl font-semibold text-primary-foreground">{avatarText}</span>
              </div>
            )}
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary-foreground">
            {profile.displayName || `${profile.name} ${profile.surname || ''}`.trim()}
          </CardTitle>
          {(profile.grade || profile.school) && (
            <CardDescription className="text-lg text-primary-foreground/90 mt-1">
              {profile.grade && <span>{profile.grade}</span>}
              {profile.grade && profile.school && <span> @ </span>}
              {profile.school && <span>{profile.school}</span>}
            </CardDescription>
          )}
           <div className="mt-3 text-sm text-yellow-300 font-medium">
             Role / Badges Coming Soon! 
           </div>
        </CardHeader>

        <CardContent className="border-t border-b border-primary-foreground/30 p-4 md:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <BookOpenCheck className="h-7 w-7 mx-auto text-primary-foreground mb-1" />
              <p className="text-xl font-bold text-primary-foreground">{stories.length}</p>
              <p className="text-xs text-primary-foreground/80">Stories Shared</p>
            </div>
            <div>
              <Users className="h-7 w-7 mx-auto text-primary-foreground mb-1" />
              <p className="text-xl font-bold text-primary-foreground">{profile.followersCount || 0}</p>
              <p className="text-xs text-primary-foreground/80">Followers</p>
            </div>
            <div>
              <Heart className="h-7 w-7 mx-auto text-primary-foreground mb-1" />
              <p className="text-xl font-bold text-primary-foreground">{profile.followingCount || 0}</p>
              <p className="text-xs text-primary-foreground/80">Following</p>
            </div>
             <div>
              <Award className="h-7 w-7 mx-auto text-primary-foreground mb-1" />
              <p className="text-xl font-bold text-primary-foreground">-</p>
              <p className="text-xs text-primary-foreground/80">Awards (Soon)</p>
            </div>
          </div>
        </CardContent>
        
        <CardContent className="p-4 md:p-6 text-center">
          {currentUser && currentUser.uid !== profile.uid && (
            <FollowButton targetUserId={profile.uid} />
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground mb-6"> 
          Stories by {profile.displayName || profile.name}
        </h2>
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 shadow-md bg-gradient-to-br from-[#2D9CDB]/70 to-[#70C1B3]/70 text-primary-foreground border-primary/30">
            <CardContent>
               <Image 
                src="https://placehold.co/150x100.png?text=No+Stories" 
                alt="Child reading a book" 
                width={150} 
                height={100} 
                className="mx-auto mb-4 rounded-md"
                data-ai-hint="child reading book"
              />
              <p className="text-lg text-primary-foreground/90">
                {profile.displayName || profile.name} hasn't shared any stories yet.
              </p>
               {currentUser && currentUser.uid === profile.uid && (
                <Button asChild className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    <Link href="/create-story">Start a Story</Link>
                </Button>
               )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

    

