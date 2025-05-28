
export interface Story {
  id: string;
  title: string;
  content: string;
  author: string; // Display name of the author
  authorId: string; // UID of the Firebase user who created the story
  grade: string; // e.g., "Grade 5"
  subject: string; // e.g., "Science", "Math"
  language: string; // e.g., "English", "isiXhosa"
  theme?: string; // e.g., "Science", "Life Skills"
  imageUrl?: string; 
  createdAt: string; // ISO date string (client-side representation after fetching)
  // For Firestore, createdAt will be a Timestamp, converted to string on fetch
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}
