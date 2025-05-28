
"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { storyAssistance, StoryAssistanceInput, StoryAssistanceOutput } from "@/ai/flows/ai-story-guide";
import { translateStory, TranslateStoryInput, TranslateStoryOutput } from "@/ai/flows/ai-translator";
import { generateStoryImage, GenerateStoryImageInput, GenerateStoryImageOutput } from "@/ai/flows/generate-story-image-flow";
import { storyThemes, storyLanguages } from "@/lib/dummy-data";
import { Loader2, Wand2, LanguagesIcon, Image as ImageIcon, Share2 } from "lucide-react";
import Image from "next/image";

const storyFormSchema = z.object({
  storyText: z.string().min(10, { message: "Your story needs to be a bit longer!" }),
  theme: z.string().optional(),
});

const translateFormSchema = z.object({
  targetLanguage: z.string().min(1, { message: "Please select a language." }),
});

const pageContentSchema = z.object({
  firstPageText: z.string().min(10, { message: "Please describe the first page scene (min 10 characters)."}),
});

export default function CreateStoryClientPage() {
  const { toast } = useToast();
  const [isAssistanceLoading, startAssistanceTransition] = useTransition();
  const [isTranslationLoading, startTranslationTransition] = useTransition();
  const [isImageGenerating, startImageGenerationTransition] = useTransition();
  const [isSharingLoading, startSharingTransition] = useTransition(); // For future use
  
  const [aiSuggestions, setAiSuggestions] = useState<StoryAssistanceOutput | null>(null);
  const [translatedStory, setTranslatedStory] = useState<string | null>(null);
  const [firstPageImageUrl, setFirstPageImageUrl] = useState<string | null>(null);

  const storyForm = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: { storyText: "", theme: "" },
  });

  const translateForm = useForm<z.infer<typeof translateFormSchema>>({
    resolver: zodResolver(translateFormSchema),
    defaultValues: { targetLanguage: "" },
  });

  const pageContentForm = useForm<z.infer<typeof pageContentSchema>>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      firstPageText: "",
    },
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
  
  async function handleGetAiImage() {
    const validationResult = pageContentForm.trigger("firstPageText");
    if (!await validationResult || !pageContentForm.formState.isValid) {
      toast({
        variant: "destructive",
        title: "Missing Text",
        description: "Please write some text for Page 1 before generating an image.",
      });
      return;
    }
    const pageText = pageContentForm.getValues("firstPageText");

    setFirstPageImageUrl(null); 

    startImageGenerationTransition(async () => {
      try {
        const imagePrompt = `A whimsical and vibrant children's storybook illustration for a story page. The scene depicts: ${pageText}. Ensure the style is friendly, colorful, and appropriate for young children.`;
        const input: GenerateStoryImageInput = { prompt: imagePrompt };
        const result: GenerateStoryImageOutput = await generateStoryImage(input);
        setFirstPageImageUrl(result.imageDataUri);
        toast({
          title: "Image Generated!",
          description: "Your AI illustration is ready.",
        });
      } catch (error) {
        console.error("Error generating AI image:", error);
        const errorMessage = error instanceof Error ? error.message : "Could not generate image. Please try again.";
        toast({
          variant: "destructive",
          title: "Image Generation Failed",
          description: errorMessage,
        });
        setFirstPageImageUrl(null); 
      }
    });
  };

  function handleShareToLibrary() {
    // In a real app, you'd collect story data and send it to a backend
    const pageText = pageContentForm.getValues("firstPageText");
    if (!firstPageImageUrl || !pageText) {
        toast({variant: "destructive", title: "Missing Content", description: "Image or text for the page is missing."});
        return;
    }
    startSharingTransition(async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        toast({
            title: "Sharing to Library...",
            description: "This feature is coming soon! Your story page would be shared here.",
        });
    });
  }

  return (
    <div className="space-y-8 max-w-3xl">
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
                    <FormLabel className="text-lg">Your Story Idea</FormLabel>
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
        <>
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

          <Card className="shadow-lg bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
            <CardHeader>
              <CardTitle>Craft Your First Page</CardTitle>
              <CardDescription>Write the text for the first page of your story and generate an illustration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...pageContentForm}>
                <form className="space-y-4">
                  <FormField
                    control={pageContentForm.control}
                    name="firstPageText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Page 1 Text</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="The adventure begins here... describe the scene, characters, and what's happening."
                            className="min-h-[150px] text-base resize-none bg-background/70"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div>
                <Label className="text-lg font-medium">Page 1 Illustration</Label>
                <div className="mt-2 aspect-video w-full bg-muted/30 rounded-md flex items-center justify-center border border-dashed border-foreground/30 p-2">
                  {isImageGenerating ? (
                     <div className="flex flex-col items-center text-muted-foreground">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                        <p>Generating your illustration...</p>
                     </div>
                  ) : firstPageImageUrl ? (
                    <Image
                      src={firstPageImageUrl}
                      alt="Generated story illustration"
                      width={400}
                      height={225}
                      className="rounded-md object-contain max-h-full"
                      data-ai-hint="story illustration"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                      <p>Your AI-generated image will appear here.</p>
                      <p className="text-xs">(Write text above and click "Get AI Image")</p>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleGetAiImage} variant="outline" size="lg" className="w-full bg-background/50" disabled={isImageGenerating}>
                {isImageGenerating ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ImageIcon className="mr-2 h-5 w-5" />
                )}
                Get AI Image 
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {firstPageImageUrl && (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
          <CardHeader>
            <CardTitle>Your First Page Preview</CardTitle>
            <CardDescription>Here's how your first page looks. You can share it to the library!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video w-full bg-muted/30 rounded-md flex items-center justify-center border border-foreground/30 overflow-hidden">
              <Image
                src={firstPageImageUrl}
                alt="Preview of generated story illustration"
                width={600} 
                height={338} 
                className="object-contain w-full h-full"
                data-ai-hint="story preview"
              />
            </div>
            <div>
              <h4 className="font-semibold text-md mb-1">Page Text:</h4>
              <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-md whitespace-pre-wrap">
                {pageContentForm.getValues("firstPageText") || "No text entered for this page."}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleShareToLibrary} className="w-full" disabled={isSharingLoading}>
              {isSharingLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="mr-2 h-4 w-4" />
              )}
              Share to Library (Coming Soon)
            </Button>
          </CardFooter>
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
                <Button type="submit" disabled={isTranslationLoading || isImageGenerating} className="w-full md:w-auto">
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
      
    </div>
  );
}


    

    