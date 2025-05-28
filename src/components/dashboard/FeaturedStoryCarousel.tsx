
"use client";

import type { FeaturedStory } from "@/lib/types";
import { dummyFeaturedStories } from "@/lib/dummy-data";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ThumbsUp, ArrowRight, Sparkles } from "lucide-react";

export default function FeaturedStoryCarousel() {
  const [stories, setStories] = useState<FeaturedStory[]>(dummyFeaturedStories);

  const handleUpvote = (storyId: string) => {
    // Dummy upvote logic
    setStories(prevStories =>
      prevStories.map(s =>
        s.id === storyId ? { ...s, upvotes: (s.upvotes || 0) + 1 } : s
      )
    );
    console.log("Upvoted story:", storyId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-7 w-7 text-primary" />
        <h3 className="text-2xl font-bold text-primary-foreground">Featured Stories from the Community</h3>
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80 p-4 border-primary/20">
        <div className="flex space-x-4 pb-4">
          {stories.map((story) => (
            <Card key={story.id} className="flex-shrink-0 w-64 shadow-md hover:shadow-lg transition-shadow bg-background/80">
              <Link href={`/story-library/${story.id}`} legacyBehavior>
                <a>
                  <Image
                    src={story.imageUrl || "https://placehold.co/300x200.png?text=Story+Cover"}
                    alt={story.title}
                    width={300}
                    height={180}
                    className="w-full h-36 object-cover rounded-t-lg"
                    data-ai-hint="story cover"
                  />
                </a>
              </Link>
              <CardContent className="p-3 space-y-1">
                <Link href={`/story-library/${story.id}`} legacyBehavior>
                  <a className="hover:underline">
                    <h4 className="text-md font-semibold truncate text-card-foreground">{story.title}</h4>
                  </a>
                </Link>
                <p className="text-xs text-muted-foreground">By {story.author}</p>
              </CardContent>
              <CardFooter className="p-3 flex justify-between items-center border-t">
                <Button variant="ghost" size="sm" onClick={() => handleUpvote(story.id)} className="text-muted-foreground hover:text-accent">
                  <ThumbsUp className="h-4 w-4 mr-1.5" /> {story.upvotes || 0}
                </Button>
                <Button variant="outline" size="sm" asChild className="bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary">
                  <Link href={`/story-library/${story.id}`}>
                    Read <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
