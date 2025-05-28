
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, Lightbulb, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const suggestedQuestions = [
  "What are volcanoes?",
  "How do plants make food?",
  "Tell me a fun fact about space!",
  "Why is the sky blue?",
];

export default function LearningBuddyCorner() {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  const handleNextSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % suggestedQuestions.length);
  };

  return (
    <Card className="shadow-lg bg-gradient-to-br from-[#2D9CDB] to-[#70C1B3] text-primary-foreground border-primary/50"> {/* Blue to Teal gradient */}
      <CardHeader>
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full">
                <MessageCircleQuestion className="h-7 w-7 text-white" />
            </div>
            <div>
                <CardTitle className="text-2xl font-bold">Your Learning Buddy</CardTitle>
                <CardDescription className="text-blue-100">Got a question? I'm here to help!</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white/10 rounded-lg text-center">
          <Lightbulb className="mx-auto h-8 w-8 text-yellow-300 mb-2" />
          <p className="italic">"{suggestedQuestions[currentSuggestion]}"</p>
          <Button variant="ghost" size="sm" onClick={handleNextSuggestion} className="mt-2 text-xs text-white/80 hover:text-white">
            Another idea?
          </Button>
        </div>
        <Button asChild className="w-full bg-white text-primary hover:bg-gray-100 shadow-md">
          <Link href="/ask-question">
            <Sparkles className="mr-2 h-5 w-5" /> Ask Your Own Question
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
