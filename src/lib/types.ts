
export interface Story {
  id: string;
  title: string;
  content: string;
  author: string; // Display name of the author
  authorId?: string; // UID of the Firebase user who created the story
  grade: string; // e.g., "Grade 5"
  subject: string; // e.g., "Science", "Math"
  language: string; // e.g., "English", "isiXhosa"
  theme?: string; // e.g., "Science", "Life Skills"
  imageUrl?: string; 
  createdAt: string; // ISO date string (client-side representation after fetching)
  // For Firestore, createdAt will be a Timestamp, converted to string on fetch
  status?: 'Draft' | 'In Review' | 'Published'; // For dashboard progress
  upvotes?: number; // For featured stories
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string; // URL to an image or placeholder
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
  thumbnailUrl?: string; // URL to story cover or placeholder
  status: StoryStatus;
}

export interface Achievement {
  id: string;
  name: string;
  icon: React.ElementType; // Lucide icon component
  achieved: boolean;
  description: string;
}

export interface DailyPrompt {
  id: string;
  text: string;
}

// Re-using Story for FeaturedStory, adding optional upvotes if not already present
export type FeaturedStory = Story; // Story type already includes optional upvotes

