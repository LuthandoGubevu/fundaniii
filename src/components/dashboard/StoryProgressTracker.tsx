
"use client";

import type { DashboardStoryItem } from "@/lib/types";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Edit3, CheckCircle2, History, PlusCircle, BookHeart, Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy, Timestamp, type DocumentData } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const statusIcons: Record<DashboardStoryItem["status"], JSX.Element> = {
  Draft: <Edit3 className="h-4 w-4 text-yellow-500" />,
  "In Review": <History className="h-4 w-4 text-blue-500" />,
  Published: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  Shared: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

export default function StoryProgressTracker() {
  const [stories, setStories] = useState<DashboardStoryItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setStories([]);
        setIsLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const storiesRef = collection(db, "stories");
    const q = query(
      storiesRef,
      where("authorId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeFirestore = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedStories: DashboardStoryItem[] = querySnapshot.docs.map(
          (doc: DocumentData) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || "Untitled Story",
              thumbnailUrl: data.imageUrl || "https://placehold.co/150x100.png?text=Story",
              status: ["Draft", "In Review", "Published", "Shared"].includes(data.status) ? data.status : "Draft",
            } as DashboardStoryItem;
          }
        );
        setStories(fetchedStories);
        setIsLoading(false);
      },
      (error: any) => {
        console.error("Error fetching user stories for progress tracker:", error);
        let errorDesc = "Could not fetch your stories. Please try again later.";
        if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("insufficient permissions"))) {
          errorDesc = "Failed to load stories due to Firestore permissions. Please check your Firestore Security Rules for reading the 'stories' collection.";
        }
        toast({
          variant: "destructive",
          title: "Error Loading Your Stories",
          description: errorDesc,
          duration: 9000,
        });
        setStories([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribeFirestore();
  }, [currentUser, toast]);

  return (
    <Card className="shadow-lg bg-gradient-to-br from-[#2D9CDB] to-[#70C1B3] text-primary-foreground border-primary/50">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary-foreground">Your Story Creations</CardTitle>
        <CardDescription className="text-primary-foreground/90">Keep track of your amazing tales!</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
          </div>
        ) : stories.length > 0 ? (
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex space-x-4">
              {stories.map((story) => (
                <Link href={`/story-library/${story.id}`} key={story.id} legacyBehavior>
                  <a className="group flex-shrink-0 w-40">
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-200 bg-background/70 hover:border-primary text-card-foreground">
                      <Image
                        src={story.thumbnailUrl || "https://placehold.co/150x100.png?text=Story"}
                        alt={story.title}
                        width={150}
                        height={100}
                        className="w-full h-24 object-cover"
                        data-ai-hint="story thumbnail child"
                      />
                      <div className="p-3">
                        <h4 className="text-sm font-medium truncate text-card-foreground group-hover:text-primary">{story.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          {statusIcons[story.status] || statusIcons["Draft"]}
                          <span className="ml-1.5">{story.status}</span>
                        </div>
                      </div>
                    </Card>
                  </a>
                </Link>
              ))}
              <Link href="/create-story" legacyBehavior>
                <a className="group flex-shrink-0 w-40 flex flex-col items-center justify-center">
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-200 bg-background/50 hover:border-primary w-full h-full flex flex-col items-center justify-center border-2 border-dashed text-card-foreground">
                    <PlusCircle className="h-10 w-10 text-muted-foreground group-hover:text-primary mb-2" />
                    <span className="text-sm text-muted-foreground group-hover:text-primary">Start New Story</span>
                  </Card>
                </a>
              </Link>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <BookHeart className="mx-auto h-12 w-12 mb-3 text-primary-foreground" />
            <p className="mb-3 text-primary-foreground">You haven't created any stories yet.</p>
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-primary-foreground">
              <Link href="/create-story">
                <PlusCircle className="mr-2 h-4 w-4" /> Start Your First Story
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

