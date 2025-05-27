
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Story } from "@/lib/types";
import { ArrowRight, BookOpen, Tag, UserCircle, CalendarDays } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';


interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const contentSnippet = story.content.length > 100 ? story.content.substring(0, 100) + "..." : story.content;
  const createdAt = new Date(story.createdAt);

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
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
        <p className="text-xs text-muted-foreground flex items-center mb-2 sm:mb-0">
          <CalendarDays className="w-3 h-3 mr-1.5" />
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
        {/* Link to a potential full story page - for now, just a placeholder action */}
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/story-library/${story.id}`}>
            Read More <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
