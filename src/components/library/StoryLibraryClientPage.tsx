
"use client";

import { useState, useEffect } from "react";
import StoryCard from "@/components/story/StoryCard";
import { storyGrades, storySubjects, storyLanguages, dummyStories } from "@/lib/dummy-data";
import type { Story } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FilterX, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp, onSnapshot } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const ALL_FILTER_VALUE = "_all_";

export default function StoryLibraryClientPage() {
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const storiesCollectionRef = collection(db, "stories");
    const q = query(storiesCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedStories: Story[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp 
                          ? data.createdAt.toDate().toISOString() 
                          : (data.createdAt || new Date().toISOString()); 
        return {
          id: doc.id,
          ...data,
          upvotes: data.upvotes || 0, // Ensure upvotes defaults to 0
          createdAt,
        } as Story;
      });

      if (fetchedStories.length > 0) {
        setAllStories(fetchedStories);
      } else {
        console.log("No stories found in Firestore, using dummy stories as fallback.");
        setAllStories(dummyStories.map(s => ({...s, upvotes: s.upvotes || 0})));
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching stories from Firestore:", error);
      toast({
        variant: "destructive",
        title: "Error Loading Stories",
        description: "Could not fetch stories. Displaying placeholder stories instead.",
      });
      setAllStories(dummyStories.map(s => ({...s, upvotes: s.upvotes || 0}))); 
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup onSnapshot listener
  }, [toast]);

  useEffect(() => {
    if (isLoading) return; 

    let currentStories = [...allStories];

    if (gradeFilter) {
      currentStories = currentStories.filter(story => story.grade === gradeFilter);
    }
    if (subjectFilter) {
      currentStories = currentStories.filter(story => story.subject === subjectFilter);
    }
    if (languageFilter) {
      currentStories = currentStories.filter(story => story.language === languageFilter);
    }
    if (searchTerm) {
      currentStories = currentStories.filter(story => 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (story.content && story.content.toLowerCase().includes(searchTerm.toLowerCase())) || 
        story.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredStories(currentStories);
  }, [gradeFilter, subjectFilter, languageFilter, searchTerm, allStories, isLoading]);

  const resetFilters = () => {
    setGradeFilter("");
    setSubjectFilter("");
    setLanguageFilter("");
    setSearchTerm("");
  };
  
  const handleStoryLikeUpdate = (storyId: string, newLikes: number) => {
    setAllStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId ? { ...story, upvotes: newLikes } : story
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      <Card className="shadow-lg bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Story Library</CardTitle>
          <CardDescription>Explore stories created by other learners. Filter by grade, subject, or language.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search stories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/70"
              />
            </div>
            <Select 
              value={gradeFilter} 
              onValueChange={(value) => setGradeFilter(value === ALL_FILTER_VALUE ? "" : value)}
            >
              <SelectTrigger className="bg-background/70"><SelectValue placeholder="Filter by Grade" /></SelectTrigger>
              <SelectContent>
                <SelectItem key="all-grades-option" value={ALL_FILTER_VALUE}>All Grades</SelectItem>
                {storyGrades.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select 
              value={subjectFilter} 
              onValueChange={(value) => setSubjectFilter(value === ALL_FILTER_VALUE ? "" : value)}
            >
              <SelectTrigger className="bg-background/70"><SelectValue placeholder="Filter by Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem key="all-subjects-option" value={ALL_FILTER_VALUE}>All Subjects</SelectItem>
                {storySubjects.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select 
              value={languageFilter} 
              onValueChange={(value) => setLanguageFilter(value === ALL_FILTER_VALUE ? "" : value)}
            >
              <SelectTrigger className="bg-background/70"><SelectValue placeholder="Filter by Language" /></SelectTrigger>
              <SelectContent>
                <SelectItem key="all-languages-option" value={ALL_FILTER_VALUE}>All Languages</SelectItem>
                {storyLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           {(gradeFilter || subjectFilter || languageFilter || searchTerm) && (
            <Button onClick={resetFilters} variant="outline" className="w-full md:w-auto bg-background/50">
              <FilterX className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} onLikeUpdated={handleStoryLikeUpdate} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-md bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
          <CardContent>
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl">No Stories Found</CardTitle>
            <CardDescription className="mt-2">
              Try adjusting your search or filters.
            </CardDescription>
            {(gradeFilter || subjectFilter || languageFilter || searchTerm) && (
                <Button onClick={resetFilters} variant="link" className="mt-4">
                Clear all filters
                </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
