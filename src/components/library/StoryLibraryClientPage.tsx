
"use client";

import { useState, useEffect } from "react";
import StoryCard from "@/components/story/StoryCard";
import { storyGrades, storySubjects, storyLanguages } from "@/lib/dummy-data"; // Keep for filter dropdowns
import type { Story } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FilterX, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";

const ALL_FILTER_VALUE = "_all_";

export default function StoryLibraryClientPage() {
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      setIsLoading(true);
      try {
        const storiesCollectionRef = collection(db, "stories");
        const q = query(storiesCollectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedStories: Story[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore Timestamp to ISO string for client-side compatibility
          const createdAt = data.createdAt instanceof Timestamp 
                            ? data.createdAt.toDate().toISOString() 
                            : new Date().toISOString(); // Fallback if not a timestamp
          return {
            id: doc.id,
            ...data,
            createdAt,
          } as Story;
        });
        setAllStories(fetchedStories);
      } catch (error) {
        console.error("Error fetching stories from Firestore:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Stories",
          description: "Could not fetch stories from the library. Please try again later.",
        });
        // Optionally, set allStories to an empty array or keep dummy data as fallback
        setAllStories([]); 
      } finally {
        setIsLoading(false);
      }
    }
    fetchStories();
  }, []);

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
  
  // Toast import is missing, let's add it
  const { toast } = (typeof window !== 'undefined' && require('@/hooks/use-toast')) || { toast: () => {} };


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
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-md bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
          <CardContent>
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl">No Stories Found</CardTitle>
            <CardDescription className="mt-2">
              Try adjusting your search or filters, or create a new story!
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
