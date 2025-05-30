
import { UserProfile } from "@/lib/types";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import UserCard from "@/components/explore/UserCard";
import { Compass, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, "users");
    // Consider adding pagination for large numbers of users
    const q = query(usersRef, orderBy("createdAt", "desc"), limit(50)); // Example limit
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
  } catch (error) {
    console.error("Error fetching users for explore page:", error);
    return []; // Return empty array on error
  }
}

export default async function ExplorePage() {
  const users = await getAllUsers();
  // Note: We cannot easily get the *current* user on the server to exclude them
  // The FollowButton internally handles not showing for oneself.

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
            <CardTitle className="text-xl">No Users Found</CardTitle>
            <CardDescription className="mt-2">
              It seems a bit quiet here. Check back later!
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const metadata = {
  title: "Explore Users | Fundanii Ai",
  description: "Discover and connect with other users on Fundanii Ai.",
};
