
import type { UserProfile, Story } from "@/lib/types";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { notFound } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StoryCard from "@/components/story/StoryCard";
import FollowButton from "@/components/profile/FollowButton"; // We will create this
import { Users, BookOpenCheck, Heart, ArrowLeft } from "lucide-react";

async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { uid: userSnap.id, ...userSnap.data() } as UserProfile;
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
    return { id: doc.id, ...data, createdAt } as Story;
  });
}

// Note: We can't reliably get the *currently signed-in* user's ID in a Server Component
// that needs to be dynamic per request without involving client components or middleware.
// The FollowButton will handle its own auth state to determine if current user can follow.

export default async function ProfilePage({ params }: { params: { uid: string } }) {
  const profile = await getUserProfile(params.uid);
  
  if (!profile) {
    notFound();
  }

  const stories = await getUserStories(params.uid);

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
          {/* FollowButton will check auth status internally */}
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

export async function generateMetadata({ params }: { params: { uid: string } }) {
  const profile = await getUserProfile(params.uid);
  if (!profile) {
    return {
      title: "Profile Not Found | Fundanii Ai",
    };
  }
  return {
    title: `${profile.displayName || profile.name}'s Profile | Fundanii Ai`,
    description: `Explore stories and profile of ${profile.displayName || profile.name}.`,
  };
}

