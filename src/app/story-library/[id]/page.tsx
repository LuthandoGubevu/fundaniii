
import { dummyStories } from "@/lib/dummy-data";
import type { Story } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle, CalendarDays, Tag } from "lucide-react";
import Image from "next/image";
import { format } from 'date-fns';

export async function generateStaticParams() {
  return dummyStories.map((story) => ({
    id: story.id,
  }));
}

async function getStory(id: string): Promise<Story | undefined> {
  // In a real app, you would fetch this from a database
  return dummyStories.find((story) => story.id === id);
}

export default async function SingleStoryPage({ params }: { params: { id: string } }) {
  const story = await getStory(params.id);

  if (!story) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Story not found</h1>
        <p className="text-muted-foreground">The story you are looking for does not exist.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/story-library">Back to Library</Link>
        </Button>
      </div>
    );
  }
  const createdAt = new Date(story.createdAt);

  return (
    <div className="max-w-3xl mx-auto">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/story-library">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Link>
      </Button>
      <Card className="shadow-xl">
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
            <span className="flex items-center"><CalendarDays className="w-4 h-4 mr-1.5" />{format(createdAt, "MMMM d, yyyy")}</span>
          </div>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none dark:prose-invert prose-p:text-foreground/90 prose-headings:text-foreground">
          {/* Using whitespace-pre-wrap to respect newlines from dummy data for better readability */}
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
    title: `${story.title} | Fundanii Tales`,
    description: story.content.substring(0, 160),
  };
}
