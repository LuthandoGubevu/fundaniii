
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { aiLearningCompanion, AiLearningCompanionInput, AiLearningCompanionOutput } from "@/ai/flows/ai-learning-companion";
import type { ChatMessage } from "@/lib/types";
import { Loader2, Send, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const questionFormSchema = z.object({
  question: z.string().min(3, { message: "Question must be at least 3 characters." }),
});

export default function AskQuestionClientPage() {
  const { toast } = useToast();
  const [isAiResponding, startAiResponseTransition] = useTransition();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: { question: "" },
  });

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages]);

  async function onSubmit(values: z.infer<typeof questionFormSchema>) {
    const userMessage: ChatMessage = {
      id: Date.now().toString() + "-user",
      sender: "user",
      text: values.question,
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    form.reset();

    startAiResponseTransition(async () => {
      try {
        const aiInput: AiLearningCompanionInput = { question: values.question };
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

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Ask for Help!</CardTitle>
        <CardDescription>Have a question about school topics? Type it below and our AI friend will help!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] w-full rounded-md border p-4" ref={scrollAreaRef}>
          {chatMessages.length === 0 && (
            <p className="text-muted-foreground text-center">Ask a question to start the conversation!</p>
          )}
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
                  "max-w-[75%] p-3 rounded-xl shadow",
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
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
      </CardContent>
      <CardFooter>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start space-x-2">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="e.g., What is a fraction?" {...field} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isAiResponding} size="icon">
              {isAiResponding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
