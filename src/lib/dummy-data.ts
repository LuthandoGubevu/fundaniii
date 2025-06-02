
import type { Story, UserProfile, Mood, DashboardStoryItem, Achievement, DailyPrompt, FeaturedStory, SubjectItem } from "./types";
import { BookOpenCheck, Edit3, CheckCircle, Award, Star, ThumbsUp, MessageCircle, Pencil, Lightbulb, Zap, BookHeart, Users, Languages, Image as ImageIconLucide, Wand2, Rocket, Palette, Globe, Brain, BookText, Sigma, FlaskConical, HeartHandshake, Sparkles, BookOpen } from "lucide-react";

export const dummyStories: Story[] = [
  {
    id: "1",
    title: "The Magical Baobab Tree",
    content: "Once upon a time, in a small village, there was a magical Baobab tree that could talk and grant wishes to those who were kind to nature...",
    author: "Lethabo M.",
    authorId: "user1",
    grade: "Grade 4",
    subject: "Life Skills",
    language: "English",
    theme: "Nature",
    imageUrl: "https://placehold.co/600x400.png?text=Magical+Baobab",
    createdAt: new Date(2023, 10, 15).toISOString(),
    status: 'Published',
    upvotes: 15,
  },
  {
    id: "2",
    title: "Sipho's Space Adventure",
    content: "Sipho always dreamed of going to space. One night, a friendly alien named Zorp visited him in a shiny spaceship and took him on an adventure across the galaxy...",
    author: "Aphiwe K.",
    authorId: "user2",
    grade: "Grade 5",
    subject: "Science",
    language: "English",
    theme: "Adventure",
    imageUrl: "https://placehold.co/600x400.png?text=Space+Adventure",
    createdAt: new Date(2023, 11, 2).toISOString(),
    status: 'Published',
    upvotes: 22,
  },
  {
    id: "3",
    title: "Ukuhamba KukaNomsa eXhoseni",
    content: "UNomsa wayethanda ukuva amabali kamakhulu wakhe. Ngenye imini, utatomkhulu wakhe wamxelela ibali elikhethekileyo malunga nezinja ezithethayo kunye neentaka eziculayo...",
    author: "Thando Z.",
    authorId: "user3",
    grade: "Grade 3",
    subject: "Languages",
    language: "isiXhosa",
    theme: "Culture",
    imageUrl: "https://placehold.co/600x400.png?text=Nomsa's+Journey",
    createdAt: new Date(2024, 0, 10).toISOString(),
    status: 'Published',
    upvotes: 10,
  },
  {
    id: "4",
    title: "The Clever Tortoise and the Greedy Lion",
    content: "In the heart of the savanna, a wise old tortoise teaches a greedy lion a lesson about sharing and community...",
    author: "Fatima B.",
    authorId: "user4",
    grade: "Grade 2",
    subject: "Life Orientation",
    language: "English",
    theme: "Friendship",
    imageUrl: "https://placehold.co/600x400.png?text=Tortoise+Lion",
    createdAt: new Date(2024, 1, 5).toISOString(),
    status: 'Published',
    upvotes: 18,
  },
  {
    id: "5",
    title: "Ibali lika Themba no Mvundla",
    content: "UThemba, umfana omncinci, wahlangana nomvundla ohlakaniphile ehlathini. Lo mvundla wamfundisa ngokubaluleka kokusebenza kanzima nokuba nethemba...",
    author: "Sizwe N.",
    authorId: "user5",
    grade: "Grade 4",
    subject: "Languages",
    language: "Zulu",
    theme: "Life Skills",
    imageUrl: "https://placehold.co/600x400.png?text=Themba+Rabbit",
    createdAt: new Date(2024, 2, 12).toISOString(),
    status: 'Published',
    upvotes: 9,
  },
  {
    id: "6",
    title: "My Journey to the Stars",
    content: "I built a rocket ship in my backyard from old boxes and sparkling paint. Last night, I blasted off to explore Mars and met a friendly robot rover...",
    author: "Neo P.",
    authorId: "user6",
    grade: "Grade 6",
    subject: "Science",
    language: "English",
    theme: "Science",
    imageUrl: "https://placehold.co/600x400.png?text=My+Rocket",
    createdAt: new Date(2024, 3, 1).toISOString(),
    status: 'Published',
    upvotes: 30,
  },
   {
    id: "7",
    title: "The Singing Zebra",
    content: "Zola the zebra was different. Instead of stripes, she had musical notes on her coat, and when she sang, the whole savanna danced!",
    author: "Chidinma A.",
    authorId: "user7",
    grade: "Grade 1",
    subject: "Arts & Culture",
    language: "English",
    theme: "Imagination",
    imageUrl: "https://placehold.co/600x400.png?text=Singing+Zebra",
    createdAt: new Date(2024, 4, 10).toISOString(),
    status: 'Published',
    upvotes: 25,
  },
  {
    id: "8",
    title: "The Lost Chameleon",
    content: "Khami the chameleon got lost in the city! He had to use all his color-changing skills to find his way back to the forest, making new friends along the way.",
    author: "Baraka J.",
    authorId: "user8",
    grade: "Grade 3",
    subject: "Life Skills",
    language: "Swahili",
    theme: "Adventure",
    imageUrl: "https://placehold.co/600x400.png?text=Lost+Chameleon",
    createdAt: new Date(2024, 5, 5).toISOString(),
    status: 'Published',
    upvotes: 12,
  }
];

export const storyThemes = ["Science", "Life Skills", "Hero's Journey", "Culture", "Nature", "Math", "Adventure", "Friendship", "Imagination", "Problem Solving"];
export const storyLanguages = ["English", "isiXhosa", "Zulu", "Swahili", "French", "Sesotho", "Setswana", "Afrikaans", "Portuguese"];
export const storyGrades = ["Grade R", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
export const storySubjects = ["Science", "Math", "English", "Life Orientation", "Languages", "Social Studies", "Arts & Culture", "Technology", "Natural Sciences", "Economic Management Sciences"];

export const dummyUserProfile: UserProfile = {
  uid: "dummy-user-id", // Added a UID for completeness
  name: "Learner", // Changed from "Lerato"
  avatarUrl: "https://placehold.co/100x100.png?text=L", // Changed text from "User"
  mood: { emoji: "😊", label: "Happy" },
  displayName: "Creative Learner", // More generic display name
  school: "Wonder School",
  grade: "Grade 4",
  followersCount: 0,
  followingCount: 0,
};

export const dummyMoods: Mood[] = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "🤔", label: "Curious" },
  { emoji: "💡", label: "Inspired" },
  { emoji: "🥳", label: "Creative" },
  { emoji: "🧑‍🎓", label: "Studious" },
];

export const dummyStoryProgress: DashboardStoryItem[] = [
  { id: "story-draft-1", title: "The Flying Rhino", thumbnailUrl: "https://placehold.co/150x100.png?text=Rhino", status: "Draft" },
  { id: "2", title: "Sipho's Space Adventure", thumbnailUrl: "https://placehold.co/150x100.png?text=Space+Adventure", status: "Shared" },
  { id: "story-review-1", title: "My Talking Dog", thumbnailUrl: "https://placehold.co/150x100.png?text=Dog", status: "In Review" },
  { id: "1", title: "The Magical Baobab Tree", thumbnailUrl: "https://placehold.co/150x100.png?text=Magical+Baobab", status: "Shared" },
  { id: "story-draft-2", title: "Mystery of the Missing Cookies", thumbnailUrl: "https://placehold.co/150x100.png?text=Cookies", status: "Draft" },
];

export const dummyDailyPrompt: DailyPrompt = {
  id: "prompt-today",
  text: "Imagine you found a secret map in your backyard! Write a story about where it leads and the adventure you have.",
};

export const dummyAchievements: Achievement[] = [
  { id: "achieve-1", name: "First Storyteller", icon: Pencil, achieved: true, description: "Wrote your very first story!" },
  { id: "achieve-2", name: "AI Collaborator", icon: Wand2, achieved: true, description: "Used an AI tool to help build a story." },
  { id: "achieve-3", name: "Globe Trotter", icon: Globe, achieved: false, description: "Translated a story into another language." },
  { id: "achieve-4", name: "Star Author", icon: Star, achieved: false, description: "Received 5 upvotes on a story." },
  { id: "achieve-5", name: "Image Whiz", icon: Palette, achieved: true, description: "Added an illustration to your story." },
  { id: "achieve-6", name: "Helpful Learner", icon: MessageCircle, achieved: false, description: "Asked 3 questions to the Learning Buddy." },
  { id: "achieve-7", name: "Rocket Scientist", icon: Rocket, achieved: true, description: "Wrote a story about space!" },
  { id: "achieve-8", name: "Brainy Explorer", icon: Brain, achieved: false, description: "Explored 5 different subjects." },
];

export const dummyFeaturedStories: FeaturedStory[] = [
  dummyStories.find(s => s.id === "6") || dummyStories[0], 
  dummyStories.find(s => s.id === "7") || dummyStories[1], 
  dummyStories.find(s => s.id === "2") || dummyStories[2], 
  dummyStories.find(s => s.id === "4") || dummyStories[3], 
  { 
    id: "feat-5", 
    title: "The Girl Who Painted Dreams", 
    content: "A young artist discovers her paintings come to life at night, taking her on magical journeys...", 
    author: "Buhle N.", 
    authorId: "user9",
    grade: "Grade 6", 
    subject: "Arts & Culture", 
    language: "English", 
    theme: "Imagination",
    imageUrl: "https://placehold.co/300x200.png?text=Painted+Dreams", 
    createdAt: new Date(2024, 2, 1).toISOString(), 
    status: "Published", 
    upvotes: 65 
  },
];

export const studySubjects: SubjectItem[] = [
  { id: "english", name: "English / Language", icon: BookText },
  { id: "maths", name: "Mathematics", icon: Sigma },
  { id: "lifeskills", name: "Life Skills", icon: Users },
  { id: "natsci", name: "Natural Sciences", icon: FlaskConical },
  { id: "readwrite", name: "Reading & Writing", icon: BookOpen },
  { id: "lifeori", name: "Life Orientation", icon: HeartHandshake },
];

