
"use client";

import type { UserProfile } from "@/lib/types";
import { db, auth } from "@/lib/firebase"; // Added auth import
import { collection, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore";
import type { User } from "firebase/auth"; // Import User type
import UserCard from "@/components/explore/UserCard";
import { Compass, Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt instanceof Timestamp 
                        ? data.createdAt.toDate().toISOString() 
                        : (typeof data.createdAt?.toDate === 'function' ? data.createdAt.toDate().toISOString() : new Date().toISOString());
      return { 
        uid: doc.id, 
        ...data,
        followersCount: data.followersCount || 0,
        followingCount: data.followingCount || 0,
        createdAt
      } as UserProfile;
    });
  } catch (error) {
    console.error("Error fetching users for explore page:", error);
    // Re-throw the error to be caught by the calling useEffect
    throw error;
  }
}

export default function ExplorePage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setIsLoading(false); // Stop loading if no user
        setUsers([]); // Clear users if any
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      if (!currentUser) { // Only fetch if a user is logged in
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error: any) {
        console.error("Failed to fetch users for explore page:", error);
        let errorDesc = "Could not fetch users. Please try again later.";
        if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("insufficient permissions"))) {
          errorDesc = "Failed to load users due to Firestore permissions. Please ensure you are logged in and check your Firestore Security Rules to allow authenticated users to read the 'users' collection.";
        }
        toast({
          variant: "destructive",
          title: "Error Loading Users",
          description: errorDesc,
          duration: 9000,
        });
      } finally {
        setIsLoading(false);
      }
    }
    // Only call fetchUsers if currentUser state is determined (either null or a user object)
    // and specifically if currentUser is truthy (meaning user is logged in).
    if (currentUser !== undefined) { // Check if auth state has been resolved
        if (currentUser) { // User is logged in
            fetchUsers();
        } else { // User is not logged in, or auth state is still loading
            setIsLoading(false); // Ensure loading is false if no user
        }
    }
  }, [currentUser, toast]);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading users...</p>
        </div>
    );
  }
  
  if (!currentUser && !isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 text-center">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80 p-8">
          <CardHeader>
            <Compass className="h-12 w-12 text-primary mx-auto mb-3" />
            <CardTitle className="text-3xl font-bold text-foreground">Explore Fundanii Users</CardTitle>
             <CardDescription className="text-lg text-muted-foreground">
                Discover and connect with other creative learners!
             </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg mb-4">Please sign in to explore other users.</p>
            <Button asChild className="mt-4" size="lg">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <CardHeader className="items-center text-center">
          <Compass className="h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-foreground">Explore Fundanii Users</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Discover and connect with other creative learners!
          </CardDescription>
        </CardHeader>
      </Card>

      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <UserCard key={user.uid} user={user} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-md bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl text-foreground">No Users Found</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              It seems a bit quiet here. Perhaps no users have signed up yet, or there was an issue fetching them.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
