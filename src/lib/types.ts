
export interface Story {
  id: string;
  title: string;
  content: string;
  author: string; // Or a User object/ID in a real app
  grade: string; // e.g., "Grade 5"
  subject: string; // e.g., "Science", "Math"
  language: string; // e.g., "English", "isiXhosa"
  theme?: string; // e.g., "Science", "Life Skills"
  imageUrl?: string; // Optional placeholder for future image integration
  createdAt: string; // ISO date string
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}
