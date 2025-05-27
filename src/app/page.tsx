
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, HelpCircle, Library, BookHeart, Zap, MessageSquareText, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8 px-4">
      {/* Title and Description */}
      <div className="mb-12 text-center">
        <BookHeart className="w-20 h-20 text-primary mb-6 mx-auto" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Welcome to Fundanii Ai!
        </h1>
        <p className="text-xl text-muted-foreground mt-3 max-w-xl mx-auto">
          Create, Learn, and Share Your Story.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card className="shadow-xl flex flex-col bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
          <CardHeader className="items-center text-center">
            <Zap className="w-10 h-10 text-primary mb-3" />
            <CardTitle className="text-2xl font-semibold">Start a Story</CardTitle>
            <CardDescription className="pt-1 min-h-[3em]">
              Unleash your creativity and begin crafting your own unique tales with AI assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow w-full mt-auto">
              <Link href="/create-story">
                <PlayCircle className="mr-2 h-5 w-5" />
                Create Now
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl flex flex-col bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
          <CardHeader className="items-center text-center">
            <MessageSquareText className="w-10 h-10 text-primary mb-3" />
            <CardTitle className="text-2xl font-semibold">Ask for Help</CardTitle>
            <CardDescription className="pt-1 min-h-[3em]">
              Get kid-friendly answers to your school questions from our helpful AI companion.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button asChild variant="secondary" size="lg" className="shadow-md hover:shadow-lg transition-shadow w-full mt-auto">
              <Link href="/ask-question">
                <HelpCircle className="mr-2 h-5 w-5" />
                Ask Question
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl flex flex-col bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
          <CardHeader className="items-center text-center">
            <BookOpen className="w-10 h-10 text-primary mb-3" />
            <CardTitle className="text-2xl font-semibold">View Library</CardTitle>
            <CardDescription className="pt-1 min-h-[3em]">
              Explore a collection of stories created by fellow learners and discover new adventures.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow w-full mt-auto">
              <Link href="/story-library">
                <Library className="mr-2 h-5 w-5" />
                Browse Stories
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
