
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
  imageUrl?: string | null; // Can be null if no image
  createdAt: string; // Should be ISO string or Firestore Timestamp compatible
  status?: 'Draft' | 'In Review' | 'Published';
  upvotes?: number;
  likedBy?: string[]; // Array of user UIDs who liked the story
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
  following?: string[]; // Array of user IDs the current user is following
  followersCount?: number; // How many users follow this user
  uid?: string; // User's own ID
  email?: string;
  school?: string;
  grade?: string;
  surname?: string;
  createdAt?: any; // Firestore Timestamp
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

export interface SubjectItem {
  id: string;
  name: string;
  icon: React.ElementType;
  color?: string;
}
