
"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { storyAssistance, StoryAssistanceInput, StoryAssistanceOutput } from "@/ai/flows/ai-story-guide";
import { translateStory, TranslateStoryInput, TranslateStoryOutput } from "@/ai/flows/ai-translator";
import { storyThemes, storyLanguages } from "@/lib/dummy-data";
import { Loader2, Wand2, LanguagesIcon, Image as ImageIcon } from "lucide-react";

const storyFormSchema = z.object({
  storyText: z.string().min(10, { message: "Your story needs to be a bit longer!" }),
  theme: z.string().optional(),
});

const translateFormSchema = z.object({
  targetLanguage: z.string().min(1, { message: "Please select a language." }),
});

export default function CreateStoryClientPage() {
  const { toast } = useToast();
  const [isAssistanceLoading, startAssistanceTransition] = useTransition();
  const [isTranslationLoading, startTranslationTransition] = useTransition();
  
  const [aiSuggestions, setAiSuggestions] = useState<StoryAssistanceOutput | null>(null);
  const [translatedStory, setTranslatedStory] = useState<string | null>(null);

  const storyForm = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: { storyText: "", theme: "" },
  });

  const translateForm = useForm<z.infer<typeof translateFormSchema>>({
    resolver: zodResolver(translateFormSchema),
    defaultValues: { targetLanguage: "" },
  });

  async function onGetAssistance(values: z.infer<typeof storyFormSchema>) {
    startAssistanceTransition(async () => {
      try {
        const assistanceInput: StoryAssistanceInput = {
          storyText: values.storyText,
          theme: values.theme,
        };
        const result = await storyAssistance(assistanceInput);
        setAiSuggestions(result);
        toast({ title: "AI Story Guide", description: "Suggestions received!" });
      } catch (error) {
        console.error("Error getting story assistance:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not get AI suggestions. Please try again." });
      }
    });
  }

  async function onTranslateStory(values: z.infer<typeof translateFormSchema>) {
    const currentStoryText = storyForm.getValues("storyText");
    if (!currentStoryText) {
      toast({ variant: "destructive", title: "Error", description: "Please write some story text before translating." });
      return;
    }

    startTranslationTransition(async () => {
      try {
        const translateInput: TranslateStoryInput = {
          story: currentStoryText,
          targetLanguage: values.targetLanguage,
        };
        const result = await translateStory(translateInput);
        setTranslatedStory(result.translatedStory);
        toast({ title: "Story Translated", description: `Story translated to ${values.targetLanguage}!` });
      } catch (error) {
        console.error("Error translating story:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not translate the story. Please try again." });
      }
    });
  }
  
  const handleIllustrate = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "The 'Illustrate My Story' feature is under development.",
    });
  };

  return (
    <div className="space-y-8 w-full max-w-3xl">
      <Card className="shadow-lg bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Let's Brainstorm your story</CardTitle>
          <CardDescription>Tell us what kind of story would you like to create & the AI will provide suggestions for you</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...storyForm}>
            <form onSubmit={storyForm.handleSubmit(onGetAssistance)} className="space-y-6">
              <FormField
                control={storyForm.control}
                name="storyText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Story</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I want to create a story about..."
                        className="min-h-[200px] text-base resize-none bg-background/70"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <FormField
                  control={storyForm.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Optional: Select a Theme</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/70">
                            <SelectValue placeholder="Choose a theme..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {storyThemes.map((theme) => (
                            <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isAssistanceLoading} className="w-full md:w-auto">
                  {isAssistanceLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Wand2 className="mr-2 h-4 w-4" /> Get AI Story Guide
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {aiSuggestions && (
        <Card className="shadow-md bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
          <CardHeader>
            <CardTitle>AI Story Guide Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-md">Structure Guidance:</h4>
              <p className="text-muted-foreground">{aiSuggestions.structureGuidance}</p>
            </div>
            <div>
              <h4 className="font-semibold text-md">Next Part Suggestions:</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                {aiSuggestions.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <CardHeader>
          <CardTitle>Translate Your Story</CardTitle>
          <CardDescription>Share your story in different languages.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...translateForm}>
            <form onSubmit={translateForm.handleSubmit(onTranslateStory)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <FormField
                  control={translateForm.control}
                  name="targetLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Translate to</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/70">
                            <SelectValue placeholder="Select language..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {storyLanguages.map((lang) => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isTranslationLoading} className="w-full md:w-auto">
                  {isTranslationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <LanguagesIcon className="mr-2 h-4 w-4" /> Translate Story
                </Button>
              </div>
            </form>
          </Form>
          {translatedStory && (
            <div className="mt-6 p-4 border rounded-md bg-muted/50">
              <h4 className="font-semibold text-md mb-2">Translated Story:</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{translatedStory}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <Button onClick={handleIllustrate} variant="outline" size="lg" className="bg-background/50">
          <ImageIcon className="mr-2 h-5 w-5" />
          Illustrate My Story (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
