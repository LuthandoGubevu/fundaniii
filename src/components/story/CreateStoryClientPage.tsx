
"use client";

import { useState, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { storyAssistance, StoryAssistanceInput, StoryAssistanceOutput } from "@/ai/flows/ai-story-guide";
import { translateStory, TranslateStoryInput, TranslateStoryOutput } from "@/ai/flows/ai-translator";
import { generateStoryImage, GenerateStoryImageInput, GenerateStoryImageOutput } from "@/ai/flows/generate-story-image-flow";
import { storyThemes, storyLanguages, storyGrades, storySubjects } from "@/lib/dummy-data";
import type { Story } from "@/lib/types";
import { auth, db } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
// Temporarily removed Firebase Storage imports as per user request
// import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import { Loader2, Wand2, LanguagesIcon, Image as ImageIconLucide, Share2, BookPlus } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';


const storyFormSchema = z.object({
  storyText: z.string().min(10, { message: "Your story idea needs to be a bit longer!" }),
  theme: z.string().optional(),
});

const translateFormSchema = z.object({
  targetLanguage: z.string().min(1, { message: "Please select a language." }),
});

const pageContentSchema = z.object({
  firstPageText: z.string().min(10, { message: "Please describe the first page scene (min 10 characters)."}),
});

const storyDetailsSchema = z.object({
  title: z.string().min(3, { message: "Story title must be at least 3 characters." }),
  grade: z.string().min(1, { message: "Please select a grade." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  language: z.string().min(1, { message: "Please select a language." }),
});

export default function CreateStoryClientPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');

  const [isAssistanceLoading, startAssistanceTransition] = useTransition();
  const [isTranslationLoading, startTranslationTransition] = useTransition();
  const [isImageGenerating, startImageGenerationTransition] = useTransition();
  const [isSharingLoading, startSharingTransition] = useTransition();
  
  const [aiSuggestions, setAiSuggestions] = useState<StoryAssistanceOutput | null>(null);
  const [translatedStory, setTranslatedStory] = useState<string | null>(null);
  const [firstPageImageUrl, setFirstPageImageUrl] = useState<string | null>(null); 


  const storyForm = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: { storyText: initialPrompt || "", theme: "" },
  });

  const translateForm = useForm<z.infer<typeof translateFormSchema>>({
    resolver: zodResolver(translateFormSchema),
    defaultValues: { targetLanguage: "" },
  });

  const pageContentForm = useForm<z.infer<typeof pageContentSchema>>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: { firstPageText: "" },
  });

  const storyDetailsForm = useForm<z.infer<typeof storyDetailsSchema>>({
    resolver: zodResolver(storyDetailsSchema),
    defaultValues: { title: "", grade: "", subject: "", language: "" },
  });

  // Auto-get assistance if prompt is present in URL
  useEffect(() => {
    if (initialPrompt && !aiSuggestions) {
      storyForm.setValue("storyText", initialPrompt);
      onGetAssistance({ storyText: initialPrompt, theme: storyForm.getValues("theme") });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);


  async function onGetAssistance(values: z.infer<typeof storyFormSchema>) {
    startAssistanceTransition(async () => {
      try {
        const assistanceInput: StoryAssistanceInput = {
          storyText: values.storyText,
          theme: values.theme,
        };
        const result = await storyAssistance(assistanceInput);
        setAiSuggestions(result);
        if (result && result.suggestions && result.suggestions.length > 0) {
          pageContentForm.setValue("firstPageText", result.suggestions[0]);
        }
        toast({ title: "AI Story Guide", description: "Suggestions received!" });
      } catch (error) {
        console.error("Error getting story assistance:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ 
          variant: "destructive", 
          title: "AI Story Guide Error", 
          description: `Could not get AI suggestions: ${errorMessage}. Please check server logs for more details.` 
        });
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
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ 
            variant: "destructive", 
            title: "Translation Error", 
            description: `Could not translate story: ${errorMessage}. Please check server logs.`
        });
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
        const imagePrompt = `A whimsical and vibrant children's storybook illustration for a story page. The scene depicts: ${pageText}. Ensure the style is friendly, colorful, and appropriate for young children. No text or words in the image.`;
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

  async function onShareToLibrary(values: z.infer<typeof storyDetailsSchema>) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to share a story." });
      return;
    }

    const firstPageText = pageContentForm.getValues("firstPageText");
    const theme = storyForm.getValues("theme");

    if (!firstPageText) {
        toast({variant: "destructive", title: "Missing Content", description: "Text for the page is missing for sharing."});
        return;
    }
    
    let finalImageUrlForFirestore: string | null = null; 

    // Bypassing Firebase Storage upload as per user request
    if (firstPageImageUrl && firstPageImageUrl.startsWith('data:image')) {
      // For now, we are not uploading. ImageUrl in Firestore will be null.
      // This is where you'd normally put the Firebase Storage upload logic.
      // For testing, we'll keep finalImageUrlForFirestore as null or the placeholder if no real image.
      // finalImageUrlForFirestore = firstPageImageUrl; // If storing Data URI directly (NOT RECOMMENDED for prod)
      console.log("Bypassing actual image upload to Firebase Storage. Storing placeholder or null.");
      // If you want to use the placeholder that was shown, you could set it here,
      // but it's better to store null if a real upload didn't happen.
      // finalImageUrlForFirestore = "https://placehold.co/600x400.png?text=Story+Image";
      // For now, we explicitly set it to null because we are "bypassing"
      finalImageUrlForFirestore = null; 
    }


    startSharingTransition(async () => {
      try {
        const authorName = currentUser.displayName || currentUser.email?.split('@')[0] || "Anonymous Learner";
        
        const storyToSave: Omit<Story, 'id' | 'createdAt'> & { createdAt: any, authorId: string } = {
          title: values.title,
          content: firstPageText, 
          author: authorName,
          authorId: currentUser.uid,
          grade: values.grade,
          subject: values.subject,
          language: values.language,
          theme: theme || "General",
          imageUrl: finalImageUrlForFirestore, 
          createdAt: serverTimestamp(),
          upvotes: 0,
          likedBy: [], // Initialize likedBy array
        };

        await addDoc(collection(db, "stories"), storyToSave);

        toast({
            title: "Story Shared!",
            description: "Your story has been added to the library.",
        });

        storyForm.reset({ storyText: "", theme: "" });
        pageContentForm.reset();
        storyDetailsForm.reset();
        setAiSuggestions(null);
        setFirstPageImageUrl(null);
        setTranslatedStory(null);

      } catch (error: any) {
        console.error("Error sharing story:", error);
        let errorMessage = "An unknown error occurred while sharing.";
        if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("missing or insufficient permissions"))) {
          errorMessage = "Sharing failed due to Firestore permissions. Please check your Firestore Security Rules to allow creating documents in the 'stories' collection, ensuring 'authorId' matches your UID.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast({ variant: "destructive", title: "Sharing Failed", description: errorMessage, duration: 9000 });
      }
    });
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <Card className="shadow-lg bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Let's Brainstorm your story</CardTitle>
          <CardDescription>Tell us what kind of story would you like to create &amp; the AI will provide suggestions for you</CardDescription>
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
                      <Select onValueChange={field.onChange} value={field.value} defaultValue="">
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

      {aiSuggestions && (
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
                <Label className="text-lg font-medium" htmlFor="page1-illustration">Page 1 Illustration</Label>
                <div id="page1-illustration" className="mt-2 aspect-video w-full bg-muted/30 rounded-md flex items-center justify-center border border-dashed border-foreground/30 p-2">
                  {isImageGenerating ? (
                     <div className="flex flex-col items-center text-muted-foreground">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                        <p>Generating your illustration...</p>
                     </div>
                  ) : firstPageImageUrl ? (
                    <Image
                      src={firstPageImageUrl}
                      alt="Generated story illustration for page 1"
                      width={400}
                      height={225}
                      className="rounded-md object-contain max-h-full"
                      data-ai-hint="story illustration child"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIconLucide className="mx-auto h-12 w-12 mb-2" />
                      <p>Your AI-generated image will appear here.</p>
                      <p className="text-xs">(Write text above and click "Get AI Image")</p>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleGetAiImage} variant="outline" size="lg" className="w-full bg-background/50" disabled={isImageGenerating || isSharingLoading }>
                {isImageGenerating ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ImageIconLucide className="mr-2 h-5 w-5" />
                )}
                Get AI Image 
              </Button>
            </CardContent>
          </Card>
      )}

      {firstPageImageUrl && ( 
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <BookPlus className="mr-3 h-8 w-8 text-primary"/> Publish Story Details
            </CardTitle>
            <CardDescription>Review your first page, add some details, and share your masterpiece to the library!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-md mb-1">Page 1 Preview:</h4>
                <div className="aspect-video w-full bg-muted/30 rounded-md flex items-center justify-center border border-foreground/30 overflow-hidden mb-2">
                  {firstPageImageUrl.startsWith('data:image') ? (
                     <Image
                        src={firstPageImageUrl} 
                        alt="Preview of generated story illustration"
                        width={600} 
                        height={338} 
                        className="object-contain w-full h-full"
                        data-ai-hint="story preview child"
                      />
                  ) : (
                     <Image
                        src={firstPageImageUrl} 
                        alt="Story illustration placeholder"
                        width={600}
                        height={338}
                        className="object-contain w-full h-full"
                        data-ai-hint="story placeholder child"
                      />
                  )}
                </div>
                <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-md whitespace-pre-wrap">
                  {pageContentForm.getValues("firstPageText") || "No text entered for this page."}
                </p>
              </div>
            </div>

            <Form {...storyDetailsForm}>
              <form onSubmit={storyDetailsForm.handleSubmit(onShareToLibrary)} className="space-y-4">
                <FormField
                  control={storyDetailsForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Adventure" {...field} className="bg-background/70"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={storyDetailsForm.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                          <FormControl><SelectTrigger className="bg-background/70"><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {storyGrades.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={storyDetailsForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                          <FormControl><SelectTrigger className="bg-background/70"><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {storySubjects.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={storyDetailsForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                          <FormControl><SelectTrigger className="bg-background/70"><SelectValue placeholder="Select Language" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {storyLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <Button type="submit" className="w-full" disabled={isSharingLoading || isImageGenerating }>
                  {isSharingLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Share2 className="mr-2 h-4 w-4" />
                  )}
                  {isSharingLoading ? "Sharing..." : "Share to Library"}
                </Button>
              </form>
            </Form>
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
                      <Select onValueChange={field.onChange} value={field.value} defaultValue="">
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
                <Button type="submit" disabled={isTranslationLoading || isImageGenerating || isSharingLoading } className="w-full md:w-auto">
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
