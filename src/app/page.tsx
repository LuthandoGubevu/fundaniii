
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, HelpCircle, Library, BookHeart } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="items-center">
          <BookHeart className="w-16 h-16 text-primary mb-4" />
          <CardTitle className="text-4xl font-bold tracking-tight">
            Welcome to Fundanii Ai!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Create, Learn, and Share Your Story.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6 p-8">
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="African children learning and storytelling" 
              width={600} 
              height={300} 
              className="rounded-lg object-cover mx-auto"
              data-ai-hint="children storytelling"
            />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/create-story">
                <PlayCircle className="mr-2 h-5 w-5" />
                Start a Story
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/ask-question">
                <HelpCircle className="mr-2 h-5 w-5" />
                Ask for Help
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/story-library">
                <Library className="mr-2 h-5 w-5" />
                View Library
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
