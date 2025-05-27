
"use client";

import { useState, useEffect } from "react";
import StoryCard from "@/components/story/StoryCard";
import { dummyStories, storyGrades, storySubjects, storyLanguages } from "@/lib/dummy-data";
import type { Story } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FilterX } from "lucide-react";
import { Button } from "../ui/button";

export default function StoryLibraryClientPage() {
  const [stories, setStories] = useState<Story[]>(dummyStories);
  const [filteredStories, setFilteredStories] = useState<Story[]>(dummyStories);
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    let currentStories = [...stories];

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
        story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredStories(currentStories);
  }, [gradeFilter, subjectFilter, languageFilter, searchTerm, stories]);

  const resetFilters = () => {
    setGradeFilter("");
    setSubjectFilter("");
    setLanguageFilter("");
    setSearchTerm("");
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
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
                className="pl-10"
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Grade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Grades</SelectItem>
                {storyGrades.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {storySubjects.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Languages</SelectItem>
                {storyLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           {(gradeFilter || subjectFilter || languageFilter || searchTerm) && (
            <Button onClick={resetFilters} variant="outline" className="w-full md:w-auto">
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
        <Card className="text-center py-12 shadow-md">
          <CardContent>
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl">No Stories Found</CardTitle>
            <CardDescription className="mt-2">
              Try adjusting your search or filters.
            </CardDescription>
            <Button onClick={resetFilters} variant="link" className="mt-4">
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
