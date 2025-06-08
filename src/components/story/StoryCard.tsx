
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Story } from "@/lib/types";
import { ArrowRight, UserCircle, CalendarDays, Heart, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useState, useTransition, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, increment, arrayUnion, arrayRemove, Timestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import FollowButton from "@/components/profile/FollowButton";


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
  const [isLikingInProgress, startLikingTransition] = useTransition();
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

    // Optimistic UI update
    setCurrentUpvotes(newOptimisticLikes);
    setIsLiked(newIsLikedState);
    if (onLikeUpdated) onLikeUpdated(story.id, newOptimisticLikes, newIsLikedState);

    startLikingTransition(async () => {
      try {
        if (newIsLikedState) { // User is liking
          await updateDoc(storyRef, { 
            upvotes: increment(1),
            likedBy: arrayUnion(currentUser.uid)
          });
        } else { // User is unliking
          await updateDoc(storyRef, { 
            upvotes: increment(-1),
            likedBy: arrayRemove(currentUser.uid)
          });
        }
      } catch (error: any) {
        // Revert optimistic update on error
        setCurrentUpvotes(story.upvotes || 0); 
        setIsLiked(story.likedBy?.includes(currentUser.uid) || false); 
        if (onLikeUpdated) onLikeUpdated(story.id, story.upvotes || 0, story.likedBy?.includes(currentUser.uid) || false);
        
        console.error("Error liking/unliking story:", error);
        let errorDesc = "Could not update like status. Please try again.";
        if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("insufficient permissions"))) {
          errorDesc = "Liking/unliking failed due to Firestore permissions. Please check security rules for updating 'stories' collection (upvotes and likedBy fields).";
        }
        toast({ variant: "destructive", title: "Like Action Failed", description: errorDesc, duration: 9000 });
        setIsAnimatingLike(false);
      }
    });
  };
  
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
      <CardHeader>
        <Link href={`/story-library/${story.id}`} legacyBehavior>
          <a>
            <Image
              src={story.imageUrl || "https://placehold.co/300x200.png"}
              alt={story.title || "Story cover image"}
              width={300}
              height={200}
              className="rounded-t-lg object-cover w-full"
              data-ai-hint="story illustration"
            />
          </a>
        </Link>
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
            <div className="ml-2"> {/* Wrapper div for FollowButton */}
              <FollowButton targetUserId={story.authorId} />
            </div>
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
            disabled={isLikingInProgress || !currentUser}
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

