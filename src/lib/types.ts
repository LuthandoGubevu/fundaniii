
export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string; // UID of the author
  grade: string;
  subject: string;
  language: string;
  theme?: string;
  imageUrl?: string | null;
  createdAt: string; // Should be ISO string or Firestore Timestamp compatible
  status?: 'Draft' | 'In Review' | 'Published';
  upvotes?: number;
  likedBy?: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
  subject?: string;
}

export interface UserProfile {
  uid: string; // User's own ID
  name: string; // First name
  surname?: string;
  displayName?: string; // Combined name for display
  email?: string;
  avatarUrl?: string;
  school?: string;
  grade?: string;
  createdAt?: any; // Firestore Timestamp
  // Social fields
  following?: string[]; // Deprecated if using subcollections primarily for lists, but useful for quick checks. Kept for now.
  followers?: string[]; // Deprecated if using subcollections primarily for lists. Kept for now.
  followingCount?: number;
  followersCount?: number;
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
