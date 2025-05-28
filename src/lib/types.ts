
export interface Story {
  id: string;
  title: string;
  content: string;
  author: string; 
  authorId?: string; 
  grade: string; 
  subject: string; 
  language: string; 
  theme?: string; 
  imageUrl?: string; 
  createdAt: string; 
  status?: 'Draft' | 'In Review' | 'Published'; 
  upvotes?: number; 
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
  subject?: string; // Optional: to associate message with a subject context
}

export interface UserProfile {
  name: string;
  avatarUrl?: string; 
  mood?: Mood;
}

export interface Mood {
  emoji: string;
  label: string;
}

export type StoryStatus = 'Draft' | 'In Review' | 'Shared';

export interface DashboardStoryItem {
  id: string;
  title: string;
  thumbnailUrl?: string; 
  status: StoryStatus;
}

export interface Achievement {
  id: string;
  name: string;
  icon: React.ElementType; 
  achieved: boolean;
  description: string;
}

export interface DailyPrompt {
  id: string;
  text: string;
}

export type FeaturedStory = Story;

// New type for Study Buddy subjects
export interface SubjectItem {
  id: string;
  name: string;
  icon: React.ElementType; // Lucide icon component
  color?: string; // Optional color for subject card/button
}
