
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { aiLearningCompanion, AiLearningCompanionInput, AiLearningCompanionOutput } from "@/ai/flows/ai-learning-companion";
import type { ChatMessage, SubjectItem } from "@/lib/types";
import { studySubjects } from "@/lib/dummy-data";
import { Loader2, Send, User, Bot, Mic, BookText, Sigma, Users, FlaskConical, BookOpen, HeartHandshake, Sparkles, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

const questionFormSchema = z.object({
  question: z.string().min(3, { message: "Question must be at least 3 characters." }),
});

export default function MyStudyBuddyClientPage() {
  const { toast } = useToast();
  const [isAiResponding, startAiResponseTransition] = useTransition();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: { question: "" },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages]);

  async function onSubmit(values: z.infer<typeof questionFormSchema>) {
    let fullQuestion = values.question;
    if (selectedSubject) {
      fullQuestion = `For the subject "${selectedSubject.name}", please answer: ${values.question}`;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString() + "-user",
      sender: "user",
      text: values.question, // Show original question in chat
      timestamp: Date.now(),
      subject: selectedSubject?.name,
    };
    setChatMessages((prev) => [...prev, userMessage]);
    form.reset();

    startAiResponseTransition(async () => {
      try {
        const aiInput: AiLearningCompanionInput = { 
          question: values.question, // Send original question to AI
          subject: selectedSubject?.name 
        };
        const aiOutput: AiLearningCompanionOutput = await aiLearningCompanion(aiInput);
        
        const aiMessage: ChatMessage = {
          id: Date.now().toString() + "-ai",
          sender: "ai",
          text: aiOutput.answer,
          timestamp: Date.now(),
        };
        setChatMessages((prev) => [...prev, aiMessage]);

      } catch (error) {
        console.error("Error getting AI response:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not get AI response. Please try again." });
        const errorMessage: ChatMessage = {
          id: Date.now().toString() + "-error",
          sender: "ai",
          text: "Sorry, I couldn't process that. Please try again.",
          timestamp: Date.now(),
        };
        setChatMessages((prev) => [...prev, errorMessage]);
      }
    });
  }

  const handleSubjectSelect = (subject: SubjectItem) => {
    setSelectedSubject(subject);
    setChatMessages((prev) => [...prev, {
      id: Date.now().toString() + "-system",
      sender: "ai",
      text: `Okay, let's talk about ${subject.name}! What's your question?`,
      timestamp: Date.now(),
    }]);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
      <CardHeader className="text-center">
        <Bot className="mx-auto h-16 w-16 text-primary mb-2" />
        <CardTitle className="text-3xl font-bold">My Study Buddy</CardTitle>
        <CardDescription>Your friendly AI helper for homework and questions!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!selectedSubject ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center text-foreground">What subject can I help you with today?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {studySubjects.map((subject) => (
                <Button
                  key={subject.id}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-1 bg-background/50 hover:bg-primary/10"
                  onClick={() => handleSubjectSelect(subject)}
                >
                  <subject.icon className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-foreground">{subject.name}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <Button variant="outline" onClick={() => setSelectedSubject(null)} className="bg-background/50">
                Change Subject
              </Button>
              <p className="text-muted-foreground mt-2">Asking about: <span className="font-semibold text-primary">{selectedSubject.name}</span></p>
            </div>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-background/50" ref={scrollAreaRef}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg mb-3",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.sender === "ai" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] p-3 rounded-xl shadow whitespace-pre-wrap",
                      msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground" 
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {msg.sender === "ai" && !isAiResponding && !msg.text.startsWith("Okay, let's talk about") && (
                        <div className="mt-2 pt-2 border-t border-muted-foreground/20 flex flex-wrap gap-2">
                            <Button size="sm" variant="ghost" className="text-xs" onClick={() => toast({title: "Quiz feature coming soon!"})}><Sparkles className="mr-1 h-3 w-3"/>Try a Quiz</Button>
                            <Button size="sm" variant="ghost" className="text-xs" onClick={() => toast({title: "Translation feature coming soon!"})}><Languages className="mr-1 h-3 w-3"/>Translate</Button>
                        </div>
                    )}
                  </div>
                  {msg.sender === "user" && (
                    <Avatar className="h-8 w-8">
                       <AvatarFallback><User className="h-5 w-5 text-muted-foreground" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isAiResponding && (
                 <div className="flex items-start gap-3 p-3 rounded-lg mb-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] p-3 rounded-xl shadow bg-muted text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
            </ScrollArea>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start space-x-2">
                <Button type="button" variant="outline" size="icon" onClick={() => toast({title: "Voice input coming soon!"})}>
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Speak Question</span>
                </Button>
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Ask about ${selectedSubject.name}...`} {...field} className="text-base bg-background/70" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isAiResponding} size="icon">
                  {isAiResponding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
