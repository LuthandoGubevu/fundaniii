
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, HelpCircle, Library, Pencil, MessageSquareText, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center"> {/* Removed w-full */}
      {/* Title and Description */}
      <div className="mb-12 text-center">
        <Image
          src="/fundanii-logo-original.png"
          alt="Fundanii Ai Logo"
          width={600}
          height={600}
          className="mb-6 mx-auto"
        />
        <h4 className="text-5xl font-bold tracking-tight text-foreground max-w-[500px] mx-auto">
          Empowering young minds to learn, imagine, and grow through AI-powered storytelling and exploration.
        </h4>
        <p className="text-xl text-muted-foreground mt-3 max-w-xl mx-auto">
          Create, Learn, and Share Your Story.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card
          style={{ backgroundColor: '#6EA719' }}
          className="shadow-xl flex flex-col text-white bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80"
        >
          <CardHeader className="items-center text-center">
            <Pencil className="w-10 h-10 mb-3 text-white" />
            <CardTitle className="text-2xl font-semibold text-white">Start a Story</CardTitle>
            <CardDescription className="pt-1 min-h-[3em] text-white">
              Unleash your creativity and begin crafting your own unique tales with AI assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button
              asChild
              size="lg"
              className="shadow-md hover:shadow-lg transition-shadow w-full mt-auto bg-white text-black hover:bg-gray-200"
            >
              <Link href="/create-story">
                <PlayCircle className="mr-2 h-5 w-5" />
                Create Now
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card
          style={{ backgroundColor: '#FFC60B' }}
          className="shadow-xl flex flex-col text-white bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80"
        >
          <CardHeader className="items-center text-center">
            <MessageSquareText className="w-10 h-10 mb-3 text-white" />
            <CardTitle className="text-2xl font-semibold text-white">Ask for Help</CardTitle>
            <CardDescription className="pt-1 min-h-[3em] text-white">
              Get kid-friendly answers to your school questions from our helpful AI companion.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button
              asChild
              size="lg"
              className="shadow-md hover:shadow-lg transition-shadow w-full mt-auto bg-white text-black hover:bg-gray-200"
            >
              <Link href="/ask-question">
                <HelpCircle className="mr-2 h-5 w-5" />
                Ask Question
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card
          style={{ backgroundColor: '#A8218E' }}
          className="shadow-xl flex flex-col text-white bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80"
        >
          <CardHeader className="items-center text-center">
            <BookOpen className="w-10 h-10 mb-3 text-white" />
            <CardTitle className="text-2xl font-semibold text-white">View Library</CardTitle>
            <CardDescription className="pt-1 min-h-[3em] text-white">
              Explore a collection of stories created by fellow learners and discover new adventures.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button
              asChild
              size="lg"
              className="shadow-md hover:shadow-lg transition-shadow w-full mt-auto bg-white text-black hover:bg-gray-200"
            >
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
