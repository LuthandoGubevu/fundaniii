
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, HelpCircle, Library, BookHeart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center py-8 px-4">
      {/* Title and Description - No longer in a card */}
      <div className="mb-10">
        <BookHeart className="w-20 h-20 text-primary mb-6 mx-auto" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Welcome to Fundanii Ai!
        </h1>
        <p className="text-xl text-muted-foreground mt-3 max-w-xl mx-auto">
          Create, Learn, and Share Your Story.
        </p>
      </div>

      {/* Buttons in their own card, aligned horizontally */}
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Get Started</CardTitle>
          <CardDescription className="text-center text-muted-foreground pt-1">
            Choose an activity below to begin your journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow w-full">
              <Link href="/create-story">
                <PlayCircle className="mr-2 h-5 w-5" />
                Start a Story
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="shadow-md hover:shadow-lg transition-shadow w-full">
              <Link href="/ask-question">
                <HelpCircle className="mr-2 h-5 w-5" />
                Ask for Help
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow w-full">
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
