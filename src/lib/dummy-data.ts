
import type { Story, UserProfile, Mood, DashboardStoryItem, Achievement, DailyPrompt, FeaturedStory } from "./types";
import { BookOpenCheck, Edit3, CheckCircle, Award, Star, ThumbsUp, MessageCircle, Pencil, Lightbulb, Zap, BookHeart, Users, Languages, Image as ImageIconLucide, Wand2 } from "lucide-react";

export const dummyStories: Story[] = [
  {
    id: "1",
    title: "The Magical Baobab Tree",
    content: "Once upon a time, in a small village, there was a magical Baobab tree that could talk...",
    author: "Lethabo M.",
    grade: "Grade 4",
    subject: "Life Skills",
    language: "English",
    theme: "Nature",
    imageUrl: "https://placehold.co/300x200.png?text=Magical+Baobab",
    createdAt: new Date(2023, 10, 15).toISOString(),
    status: 'Published',
    upvotes: 15,
  },
  {
    id: "2",
    title: "Sipho's Space Adventure",
    content: "Sipho always dreamed of going to space. One night, a friendly alien visited him...",
    author: "Aphiwe K.",
    grade: "Grade 5",
    subject: "Science",
    language: "English",
    theme: "Science",
    imageUrl: "https://placehold.co/300x200.png?text=Space+Adventure",
    createdAt: new Date(2023, 11, 2).toISOString(),
    status: 'Published',
    upvotes: 22,
  },
  {
    id: "3",
    title: "Ukuhamba KukaNomsa eXhoseni",
    content: "UNomsa wayethanda ukuva amabali kamakhulu wakhe. Ngenye imini, utatomkhulu wakhe wamxelela ibali elikhethekileyo...",
    author: "Thando Z.",
    grade: "Grade 3",
    subject: "Languages",
    language: "isiXhosa",
    theme: "Culture",
    imageUrl: "https://placehold.co/300x200.png?text=Nomsa's+Journey",
    createdAt: new Date(2024, 0, 10).toISOString(),
    status: 'Published',
    upvotes: 10,
  },
];

export const storyThemes = ["Science", "Life Skills", "Hero's Journey", "Culture", "Nature", "Math", "Adventure", "Friendship"];
export const storyLanguages = ["English", "isiXhosa", "Zulu", "Swahili", "French", "Sesotho", "Setswana"];
export const storyGrades = ["Grade R", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"];
export const storySubjects = ["Science", "Math", "English", "Life Orientation", "Languages", "Social Studies", "Arts & Culture", "Technology"];


// --- New Dummy Data for Dashboard ---

export const dummyUserProfile: UserProfile = {
  name: "Lerato",
  avatarUrl: "https://placehold.co/100x100.png?text=User", // Placeholder for user avatar
  mood: { emoji: "😊", label: "Happy" },
};

export const dummyMoods: Mood[] = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "🤔", label: "Curious" },
  { emoji: "💡", label: "Inspired" },
  { emoji: "🥳", label: "Creative" },
];

export const dummyStoryProgress: DashboardStoryItem[] = [
  { id: "story-draft-1", title: "The Flying Rhino", thumbnailUrl: "https://placehold.co/150x100.png?text=Rhino", status: "Draft" },
  { id: "story-review-1", title: "My Talking Dog", thumbnailUrl: "https://placehold.co/150x100.png?text=Dog", status: "In Review" },
  { id: "story-shared-1", title: "The River That Sang", thumbnailUrl: "https://placehold.co/150x100.png?text=River", status: "Shared" },
  { id: "story-draft-2", title: "Mystery of the Missing Cookies", thumbnailUrl: "https://placehold.co/150x100.png?text=Cookies", status: "Draft" },
];

export const dummyDailyPrompt: DailyPrompt = {
  id: "prompt-today",
  text: "Imagine you found a secret map in your backyard! Write a story about where it leads and the adventure you have.",
};

export const dummyAchievements: Achievement[] = [
  { id: "achieve-1", name: "First Storyteller", icon: Pencil, achieved: true, description: "Wrote your very first story!" },
  { id: "achieve-2", name: "AI Collaborator", icon: Wand2, achieved: true, description: "Used an AI tool to help build a story." },
  { id: "achieve-3", name: "Globe Trotter", icon: Languages, achieved: false, description: "Translated a story into another language." },
  { id: "achieve-4", name: "Star Author", icon: Star, achieved: false, description: "Received 5 upvotes on a story." },
  { id: "achieve-5", name: "Image Whiz", icon: ImageIconLucide, achieved: true, description: "Added an illustration to your story." },
  { id: "achieve-6", name: "Helpful Learner", icon: MessageCircle, achieved: false, description: "Asked 3 questions to the Learning Buddy." },
];

export const dummyFeaturedStories: FeaturedStory[] = [
  { ...dummyStories[0], id:"feat-1", upvotes: 105, imageUrl: "https://placehold.co/300x200.png?text=Featured+1" },
  { ...dummyStories[1], id:"feat-2", upvotes: 98, imageUrl: "https://placehold.co/300x200.png?text=Featured+2" },
  { ...dummyStories[2], id:"feat-3", upvotes: 77, imageUrl: "https://placehold.co/300x200.png?text=Featured+3" },
  { 
    id: "feat-4", 
    title: "The Girl Who Painted Stars", 
    content: "A young artist discovers her paintings come to life at night...", 
    author: "Buhle N.", 
    grade: "Grade 6", 
    subject: "Arts & Culture", 
    language: "English", 
    theme: "Imagination",
    imageUrl: "https://placehold.co/300x200.png?text=Featured+4", 
    createdAt: new Date(2024, 2, 1).toISOString(), 
    status: "Published", 
    upvotes: 65 
  },
];
