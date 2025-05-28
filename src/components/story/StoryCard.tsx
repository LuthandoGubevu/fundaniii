
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Story } from "@/lib/types";
import { ArrowRight, UserCircle, CalendarDays, Tag, Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useState, useTransition } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  story: Story;
  onLikeUpdated?: (storyId: string, newLikes: number) => void; // Optional: for parent to update its state
}

export default function StoryCard({ story, onLikeUpdated }: StoryCardProps) {
  const contentSnippet = story.content.length > 100 ? story.content.substring(0, 100) + "..." : story.content;
  const createdAt = new Date(story.createdAt);
  const [isLiking, startLikingTransition] = useTransition();
  const { toast } = useToast();
  const [currentUpvotes, setCurrentUpvotes] = useState(story.upvotes || 0);
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);

  const handleLike = async () => {
    if (!auth.currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You need to be logged in to like a story.",
      });
      return;
    }
    if (isLiking) return;

    setIsAnimatingLike(true);
    setTimeout(() => setIsAnimatingLike(false), 300); // Animation duration

    startLikingTransition(async () => {
      try {
        const storyRef = doc(db, "stories", story.id);
        await updateDoc(storyRef, {
          upvotes: increment(1)
        });
        const newLikes = currentUpvotes + 1;
        setCurrentUpvotes(newLikes);
        if (onLikeUpdated) {
          onLikeUpdated(story.id, newLikes);
        }
        // No toast for successful like to avoid clutter, or add a very subtle one if desired
      } catch (error) {
        console.error("Error liking story:", error);
        toast({
          variant: "destructive",
          title: "Like Failed",
          description: "Could not update like count. Please try again.",
        });
        // Revert optimistic update if Firestore write fails
        setIsAnimatingLike(false); // Ensure animation stops on error too
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
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <UserCircle className="w-4 h-4 mr-1.5" /> By {story.author}
        </CardDescription>
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
            {formatDistanceToNow(createdAt, { addSuffix: true })}
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
