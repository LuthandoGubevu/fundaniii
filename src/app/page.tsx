
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, HelpCircle, Library, BookHeart, Zap, MessageSquareText, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex w-full flex-col items-center">
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
        <Card 
          style={{ backgroundColor: '#912B8D' }} 
          className="shadow-xl flex flex-col text-white"
        >
          <CardHeader className="items-center text-center">
            <Zap className="w-10 h-10 mb-3" /> {/* Will inherit text-white */}
            <CardTitle className="text-2xl font-semibold">Start a Story</CardTitle> {/* Will inherit text-white */}
            <CardDescription className="pt-1 min-h-[3em]"> {/* Will inherit text-white */}
              Unleash your creativity and begin crafting your own unique tales with AI assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow w-full mt-auto">
              <Link href="/create-story">
                <PlayCircle className="mr-2 h-5 w-5" /> {/* Primary button text is light, icon will match */}
                Create Now
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card 
          style={{ backgroundColor: '#F7EB32' }} 
          className="shadow-xl flex flex-col text-white" // Note: White text on yellow has low contrast
        >
          <CardHeader className="items-center text-center">
            <MessageSquareText className="w-10 h-10 mb-3" /> {/* Will inherit text-white */}
            <CardTitle className="text-2xl font-semibold">Ask for Help</CardTitle> {/* Will inherit text-white */}
            <CardDescription className="pt-1 min-h-[3em]"> {/* Will inherit text-white */}
              Get kid-friendly answers to your school questions from our helpful AI companion.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            {/* Secondary button needs explicit text-white as its default text-secondary-foreground is dark */}
            <Button asChild variant="secondary" size="lg" className="shadow-md hover:shadow-lg transition-shadow w-full mt-auto text-white hover:bg-secondary/90">
              <Link href="/ask-question">
                <HelpCircle className="mr-2 h-5 w-5" /> {/* Will use text-white from button */}
                Ask Question
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card 
          style={{ backgroundColor: '#DD4AB0' }} 
          className="shadow-xl flex flex-col text-white"
        >
          <CardHeader className="items-center text-center">
            <BookOpen className="w-10 h-10 mb-3" /> {/* Will inherit text-white */}
            <CardTitle className="text-2xl font-semibold">View Library</CardTitle> {/* Will inherit text-white */}
            <CardDescription className="pt-1 min-h-[3em]"> {/* Will inherit text-white */}
              Explore a collection of stories created by fellow learners and discover new adventures.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            {/* Outline button needs explicit text-white, border-white and hover states */}
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="shadow-md hover:shadow-lg transition-shadow w-full mt-auto border-white text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/story-library">
                <Library className="mr-2 h-5 w-5" /> {/* Will use text-white from button */}
                Browse Stories
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
