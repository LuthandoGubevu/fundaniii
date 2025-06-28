
'use client';

import { useState, useEffect } from "react";
import type { Story } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle, CalendarDays, Tag, Loader2 } from "lucide-react";
import Image from "next/image";
import { format } from 'date-fns';
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { useParams, notFound, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

async function getStory(id: string): Promise<Story | undefined> {
  try {
    const storyRef = doc(db, "stories", id);
    const storySnap = await getDoc(storyRef);

    if (storySnap.exists()) {
      const data = storySnap.data();
      const createdAt = data.createdAt instanceof Timestamp 
                        ? data.createdAt.toDate().toISOString() 
                        : (data.createdAt || new Date().toISOString());
      return { 
        id: storySnap.id, 
        ...data,
        authorId: data.authorId || null, // Ensure authorId is included
        createdAt,
      } as Story;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching story from Firestore:", error);
    // Re-throw to be caught in useEffect
    throw error;
  }
}

export default function SingleStoryPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;
  
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "Loading Story... | Fundanii Ai";
    }
  }, []);

  useEffect(() => {
    if (!id) {
        setIsLoading(false);
        return;
    };

    async function fetchStory() {
      setIsLoading(true);
      try {
        const fetchedStory = await getStory(id);
        if (fetchedStory) {
          setStory(fetchedStory);
          if (typeof document !== 'undefined') {
             document.title = `${fetchedStory.title} | Fundanii Ai`;
          }
        } else {
          notFound(); // This will render the not-found component
        }
      } catch (error: any) {
        console.error("Failed to fetch story:", error);
        toast({
            variant: "destructive",
            title: "Error loading story",
            description: "There was a problem fetching the story. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStory();
  }, [id, toast, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!story) {
    // This case is handled by notFound(), but as a fallback.
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <p>Story not found.</p>
        </div>
    );
  }
  
  const createdAtDate = new Date(story.createdAt);

  return (
    <div className="max-w-3xl mx-auto">
      <Button asChild variant="outline" size="sm" className="mb-6 bg-background/50">
        <Link href="/story-library">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Link>
      </Button>
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <CardHeader>
          <Image 
            src={story.imageUrl || "https://placehold.co/600x400.png"} 
            alt={story.title || "Story image"} 
            width={600} 
            height={400} 
            className="rounded-lg object-cover w-full h-auto max-h-[400px] mb-4"
            data-ai-hint="story detail illustration"
          />
          <CardTitle className="text-4xl font-bold">{story.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
            <span className="flex items-center">
              <UserCircle className="w-4 h-4 mr-1.5" />By{' '}
              {story.authorId ? (
                <Link href={`/profile/${story.authorId}`} className="hover:underline ml-1">{story.author}</Link>
              ) : (
                story.author
              )}
            </span>
            <span className="flex items-center"><CalendarDays className="w-4 h-4 mr-1.5" />{format(createdAtDate, "MMMM d, yyyy")}</span>
          </div>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none dark:prose-invert prose-p:text-foreground/90 prose-headings:text-foreground">
          <p className="whitespace-pre-wrap">{story.content}</p>
        </CardContent>
        <CardFooter className="pt-6 border-t">
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{story.grade}</Badge>
                <Badge variant="secondary">{story.subject}</Badge>
                <Badge variant="outline">{story.language}</Badge>
                {story.theme && <Badge variant="outline" className="bg-accent/20 text-accent-foreground flex items-center"><Tag className="w-3 h-3 mr-1"/>{story.theme}</Badge>}
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
