
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Story, UserProfile } from "@/lib/types";
import { ArrowRight, UserCircle, CalendarDays, Tag, Heart, MessageCircle, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useState, useTransition, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, increment, getDoc, arrayUnion, arrayRemove, onSnapshot, Timestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  story: Story;
  onLikeUpdated?: (storyId: string, newLikes: number) => void;
}

export default function StoryCard({ story, onLikeUpdated }: StoryCardProps) {
  const contentSnippet = story.content.length > 100 ? story.content.substring(0, 100) + "..." : story.content;
  
  let createdAtDate: Date;
  try {
    if (story.createdAt instanceof Timestamp) { // Check if it's already a Firestore Timestamp
      createdAtDate = story.createdAt.toDate();
    } else if (typeof story.createdAt === 'string') {
      createdAtDate = new Date(story.createdAt);
    } else if (story.createdAt && typeof (story.createdAt as any).seconds === 'number') { // Handle plain object with seconds/nanoseconds
      createdAtDate = new Timestamp((story.createdAt as any).seconds, (story.createdAt as any).nanoseconds).toDate();
    }
    else {
      createdAtDate = new Date(); // Fallback, though ideally createdAt is always valid
    }
  } catch (e) {
    console.warn("Error parsing story.createdAt:", story.createdAt, e);
    createdAtDate = new Date(); // Fallback
  }


  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiking, startLikingTransition] = useTransition();
  const [isFollowInProgress, startFollowTransition] = useTransition();
  const [currentUpvotes, setCurrentUpvotes] = useState(story.upvotes || 0);
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !story.authorId || currentUser.uid === story.authorId) {
      setIsFollowing(false); 
      return;
    }

    const currentUserDocRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(currentUserDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data() as UserProfile;
        setIsFollowing(userData.following?.includes(story.authorId!) || false);
      } else {
        setIsFollowing(false);
      }
    }, (error) => {
      console.error("Error fetching current user's follow status:", error);
      setIsFollowing(false);
    });

    return () => unsubscribe();
  }, [currentUser, story.authorId]);


  const handleLike = async () => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Authentication Required", description: "You need to be logged in to like a story." });
      return;
    }
    if (isLiking) return;

    setIsAnimatingLike(true);
    setTimeout(() => setIsAnimatingLike(false), 300);

    const newOptimisticLikes = currentUpvotes + 1;
    setCurrentUpvotes(newOptimisticLikes);
    if (onLikeUpdated) onLikeUpdated(story.id, newOptimisticLikes);


    startLikingTransition(async () => {
      try {
        const storyRef = doc(db, "stories", story.id);
        await updateDoc(storyRef, { upvotes: increment(1) });
      } catch (error: any) {
        console.error("Error liking story:", error);
        let errorDesc = "Could not update like count. Please try again.";
        if (error.code === "permission-denied") {
          errorDesc = "Liking failed due to Firestore permissions. Please check security rules for updating 'stories' collection.";
        }
        toast({ variant: "destructive", title: "Like Failed", description: errorDesc, duration: 7000 });
        setCurrentUpvotes(currentUpvotes); 
        if (onLikeUpdated) onLikeUpdated(story.id, currentUpvotes); 
        setIsAnimatingLike(false);
      }
    });
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !story.authorId || currentUser.uid === story.authorId) {
      toast({ variant: "destructive", title: "Action not allowed", description: !currentUser ? "Please log in to follow authors." : "You cannot follow yourself." });
      return;
    }
    if (isFollowInProgress) return;

    startFollowTransition(async () => {
      const currentUserDocRef = doc(db, "users", currentUser.uid);
      const authorUserDocRef = doc(db, "users", story.authorId!);

      try {
        if (isFollowing) {
          await updateDoc(currentUserDocRef, { following: arrayRemove(story.authorId) });
          await updateDoc(authorUserDocRef, { followersCount: increment(-1) });
          setIsFollowing(false); 
          toast({ title: "Unfollowed", description: `You are no longer following ${story.author}.` });
        } else {
          await updateDoc(currentUserDocRef, { following: arrayUnion(story.authorId) });
          await updateDoc(authorUserDocRef, { followersCount: increment(1) });
          setIsFollowing(true); 
          toast({ title: "Followed!", description: `You are now following ${story.author}.` });
        }
      } catch (error: any) {
        console.error("Error toggling follow:", error);
        let errorDesc = "Could not update follow status. Please try again.";
         if (error.code === "permission-denied") {
          errorDesc = "Follow action failed due to Firestore permissions. Please check security rules for updating 'users' collection (both 'following' and 'followersCount' fields).";
        }
        toast({ variant: "destructive", title: "Follow Action Failed", description: errorDesc, duration: 7000 });
      }
    });
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
      <CardHeader>
        {story.imageUrl && (
           <Image
            src={story.imageUrl}
            alt={story.title}
            width={300}
            height={200}
            className="rounded-t-lg object-cover w-full h-48"
            data-ai-hint="story illustration"
          />
        )}
        <CardTitle className="mt-4 text-xl font-semibold">{story.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <UserCircle className="w-4 h-4 mr-1.5" /> By {story.author}
          {currentUser && story.authorId && currentUser.uid !== story.authorId && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 p-1 h-auto"
              onClick={handleFollowToggle}
              disabled={isFollowInProgress}
            >
              {isFollowInProgress ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                isFollowing ? <UserCheck className="h-4 w-4 text-green-500" /> : <UserPlus className="h-4 w-4 text-primary" />
              )}
              <span className="ml-1 text-xs">{isFollowing ? "Following" : "Follow"}</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground/80 mb-4">{contentSnippet}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary">{story.grade}</Badge>
          <Badge variant="secondary">{story.subject}</Badge>
          <Badge variant="outline">{story.language}</Badge>
          {story.theme && <Badge variant="outline" className="bg-accent/20 text-accent-foreground">{story.theme}</Badge>}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className={cn(
              "text-destructive-foreground hover:bg-red-500/20 p-1.5 rounded-full",
              isAnimatingLike && "animate-pulse"
            )}
          >
            <Heart
              className={cn("h-5 w-5 transition-transform duration-150", isAnimatingLike && "scale-125")}
              fill="hsl(var(--destructive))"
              color="hsl(var(--destructive))"
            />
            <span className="ml-1.5 text-sm text-muted-foreground">{currentUpvotes}</span>
            <span className="sr-only">Like story</span>
          </Button>
           <p className="text-xs text-muted-foreground flex items-center">
            <CalendarDays className="w-3 h-3 mr-1.5" />
            {formatDistanceToNow(createdAtDate, { addSuffix: true })}
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/story-library/${story.id}`}>
            Read More <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
