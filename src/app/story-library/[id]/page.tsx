
import type { Story } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle, CalendarDays, Tag } from "lucide-react";
import Image from "next/image";
import { format } from 'date-fns';
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { notFound } from 'next/navigation';

// Removed generateStaticParams as this page will be dynamically rendered

async function getStory(id: string): Promise<Story | undefined> {
  try {
    const storyRef = doc(db, "stories", id);
    const storySnap = await getDoc(storyRef);

    if (storySnap.exists()) {
      const data = storySnap.data();
      // Convert Firestore Timestamp to ISO string
      const createdAt = data.createdAt instanceof Timestamp 
                        ? data.createdAt.toDate().toISOString() 
                        : (data.createdAt || new Date().toISOString()); // Fallback for existing data or if somehow not a Timestamp
      return { 
        id: storySnap.id, 
        ...data,
        createdAt,
      } as Story;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching story from Firestore:", error);
    return undefined;
  }
}

export default async function SingleStoryPage({ params }: { params: { id: string } }) {
  const story = await getStory(params.id);

  if (!story) {
    // If story not found, use Next.js notFound utility to render a 404 page
    notFound();
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
          {story.imageUrl && (
            <Image 
              src={story.imageUrl} 
              alt={story.title} 
              width={600} 
              height={400} 
              className="rounded-lg object-cover w-full h-auto max-h-[400px] mb-4"
              data-ai-hint="story detail illustration"
            />
          )}
          <CardTitle className="text-4xl font-bold">{story.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
            <span className="flex items-center"><UserCircle className="w-4 h-4 mr-1.5" />By {story.author}</span>
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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const story = await getStory(params.id);
  if (!story) {
    return {
      title: "Story Not Found",
    };
  }
  return {
    title: `${story.title} | Fundanii Ai`,
    description: story.content.substring(0, 160),
  };
}
