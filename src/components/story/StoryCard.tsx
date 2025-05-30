
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Story, UserProfile } from "@/lib/types";
import { ArrowRight, UserCircle, CalendarDays, Heart, Loader2, UserPlus, UserCheck } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useState, useTransition, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, increment, getDoc, arrayUnion, arrayRemove, onSnapshot, Timestamp, writeBatch, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  story: Story;
  onLikeUpdated?: (storyId: string, newLikes: number, newIsLiked: boolean) => void;
}

export default function StoryCard({ story, onLikeUpdated }: StoryCardProps) {
  const contentSnippet = story.content.length > 100 ? story.content.substring(0, 100) + "..." : story.content;
  
  let createdAtDate: Date;
  try {
    if (story.createdAt instanceof Timestamp) {
      createdAtDate = story.createdAt.toDate();
    } else if (typeof story.createdAt === 'string') {
      createdAtDate = new Date(story.createdAt);
    } else if (story.createdAt && typeof (story.createdAt as any).seconds === 'number') {
      createdAtDate = new Timestamp((story.createdAt as any).seconds, (story.createdAt as any).nanoseconds).toDate();
    } else {
      createdAtDate = new Date(); 
    }
  } catch (e) {
    console.warn("Error parsing story.createdAt:", story.createdAt, e);
    createdAtDate = new Date(); 
  }

  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [isLikingInProgress, startLikingTransition] = useTransition();
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
    if (currentUser && story.likedBy) {
      setIsLiked(story.likedBy.includes(currentUser.uid));
    } else {
      setIsLiked(false);
    }
    setCurrentUpvotes(story.upvotes || 0);
  }, [currentUser, story.likedBy, story.upvotes]);

  useEffect(() => {
    if (!currentUser || !story.authorId || currentUser.uid === story.authorId) {
      setIsFollowingAuthor(false); 
      return;
    }
    // Check if current user is following the story's author by checking the subcollection
    const followingDocRef = doc(db, "users", currentUser.uid, "following", story.authorId);
    const unsubscribe = onSnapshot(followingDocRef, (docSnap) => {
      setIsFollowingAuthor(docSnap.exists());
    }, (error) => {
      console.error("Error checking follow status:", error);
      setIsFollowingAuthor(false);
    });
    return () => unsubscribe();
  }, [currentUser, story.authorId]);


  const handleLikeToggle = async () => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Authentication Required", description: "You need to be logged in to like a story." });
      return;
    }
    if (isLikingInProgress) return;

    setIsAnimatingLike(true);
    setTimeout(() => setIsAnimatingLike(false), 300);

    const storyRef = doc(db, "stories", story.id);
    const newOptimisticLikes = isLiked ? currentUpvotes - 1 : currentUpvotes + 1;
    const newIsLikedState = !isLiked;

    setCurrentUpvotes(newOptimisticLikes);
    setIsLiked(newIsLikedState);
    if (onLikeUpdated) onLikeUpdated(story.id, newOptimisticLikes, newIsLikedState);

    startLikingTransition(async () => {
      try {
        if (newIsLikedState) {
          await updateDoc(storyRef, { 
            upvotes: increment(1),
            likedBy: arrayUnion(currentUser.uid)
          });
        } else {
          await updateDoc(storyRef, { 
            upvotes: increment(-1),
            likedBy: arrayRemove(currentUser.uid)
          });
        }
      } catch (error: any) {
        console.error("Error liking/unliking story:", error);
        setCurrentUpvotes(story.upvotes || 0); // Revert
        setIsLiked(story.likedBy?.includes(currentUser.uid) || false); // Revert
        if (onLikeUpdated) onLikeUpdated(story.id, story.upvotes || 0, story.likedBy?.includes(currentUser.uid) || false);
        
        let errorDesc = "Could not update like status. Please try again.";
        if (error.code === "permission-denied") {
          errorDesc = "Liking/unliking failed due to Firestore permissions. Please check security rules for updating 'stories' collection (upvotes and likedBy fields).";
        }
        toast({ variant: "destructive", title: "Like Action Failed", description: errorDesc, duration: 7000 });
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
      const batch = writeBatch(db);
      const currentUserRef = doc(db, "users", currentUser.uid);
      const targetUserRef = doc(db, "users", story.authorId!);
      const followingDocRef = doc(currentUserRef, "following", story.authorId!);
      const followerDocRef = doc(targetUserRef, "followers", currentUser.uid);

      try {
        if (isFollowingAuthor) { // Unfollow
          batch.delete(followingDocRef);
          batch.delete(followerDocRef);
          batch.update(currentUserRef, { followingCount: increment(-1) });
          batch.update(targetUserRef, { followersCount: increment(-1) });
          await batch.commit();
          setIsFollowingAuthor(false); 
          toast({ title: "Unfollowed", description: `You are no longer following ${story.author}.` });
        } else { // Follow
          batch.set(followingDocRef, { followedAt: serverTimestamp() });
          batch.set(followerDocRef, { followedAt: serverTimestamp() });
          batch.update(currentUserRef, { followingCount: increment(1) });
          batch.update(targetUserRef, { followersCount: increment(1) });
          await batch.commit();
          setIsFollowingAuthor(true); 
          toast({ title: "Followed!", description: `You are now following ${story.author}.` });
        }
      } catch (error: any) {
        console.error("Error toggling follow:", error);
        let errorDesc = "Could not update follow status. Please try again.";
         if (error.code === "permission-denied") {
          errorDesc = "Follow action failed due to Firestore permissions. Ensure rules allow managing follow subcollections and updating follower/following counts.";
        }
        toast({ variant: "destructive", title: "Follow Action Failed", description: errorDesc, duration: 9000 });
      }
    });
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
      <CardHeader>
        {story.imageUrl && (
           <Link href={`/story-library/${story.id}`} legacyBehavior>
             <a>
                <Image
                  src={story.imageUrl}
                  alt={story.title}
                  width={300}
                  height={200}
                  className="rounded-t-lg object-cover w-full h-48"
                  data-ai-hint="story illustration"
                />
              </a>
           </Link>
        )}
        <CardTitle className="mt-4 text-xl font-semibold">
            <Link href={`/story-library/${story.id}`} className="hover:underline">{story.title}</Link>
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <UserCircle className="w-4 h-4 mr-1.5" /> 
          By {story.authorId ? (
            <Link href={`/profile/${story.authorId}`} className="hover:underline ml-1">{story.author}</Link>
          ) : (
            story.author
          )}
          {currentUser && story.authorId && currentUser.uid !== story.authorId && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 p-1 h-auto text-xs"
              onClick={handleFollowToggle}
              disabled={isFollowInProgress}
            >
              {isFollowInProgress ? <Loader2 className="h-3 w-3 animate-spin" /> : (
                isFollowingAuthor ? <UserCheck className="h-4 w-4 text-green-500 mr-1" /> : <UserPlus className="h-4 w-4 text-primary mr-1" />
              )}
              {isFollowingAuthor ? "Following" : "Follow"}
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
            onClick={handleLikeToggle}
            disabled={isLikingInProgress}
            className={cn(
              "p-1.5 rounded-full",
              isLiked ? "text-red-500 hover:bg-red-500/10" : "text-muted-foreground hover:bg-red-500/10",
              isAnimatingLike && "animate-pulse"
            )}
          >
            <Heart
              className={cn("h-5 w-5 transition-transform duration-150", isAnimatingLike && "scale-125")}
              fill={isLiked ? "currentColor" : "none"}
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
