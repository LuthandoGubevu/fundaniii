
import type { Story } from "./types";

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
    imageUrl: "https://placehold.co/300x200.png",
    createdAt: new Date(2023, 10, 15).toISOString(),
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
    imageUrl: "https://placehold.co/300x200.png",
    createdAt: new Date(2023, 11, 2).toISOString(),
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
    imageUrl: "https://placehold.co/300x200.png",
    createdAt: new Date(2024, 0, 10).toISOString(),
  },
  {
    id: "4",
    title: "The Clever Tortoise and the Greedy Lion",
    content: "In the great savanna, lived a very clever tortoise. One day, a greedy lion challenged all animals...",
    author: "Buhle S.",
    grade: "Grade 4",
    subject: "English",
    language: "English",
    theme: "Hero's Journey",
    imageUrl: "https://placehold.co/300x200.png",
    createdAt: new Date(2024, 1, 20).toISOString(),
  },
  {
    id: "5",
    title: "Amanani Kwihlabathi Lethu",
    content: "Amanani akuyo yonke indawo! Ukusuka ekubaleni iinkwenkwezi ukuya ekwabelaneni ngeelekese...",
    author: "Mandla P.",
    grade: "Grade 2",
    subject: "Math",
    language: "Zulu",
    theme: "Math",
    imageUrl: "https://placehold.co/300x200.png",
    createdAt: new Date(2024, 2, 5).toISOString(),
  },
];

export const storyThemes = ["Science", "Life Skills", "Hero's Journey", "Culture", "Nature", "Math"];
export const storyLanguages = ["English", "isiXhosa", "Zulu", "Swahili", "French"];
export const storyGrades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7"];
export const storySubjects = ["Science", "Math", "English", "Life Orientation", "Languages", "Social Studies"];
