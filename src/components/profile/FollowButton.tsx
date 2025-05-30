
"use client";

import { useState, useEffect, useTransition } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, updateDoc, increment, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For initial status check
  const [isProcessingFollow, startFollowTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !targetUserId || currentUser.uid === targetUserId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const followingDocRef = doc(db, "users", currentUser.uid, "following", targetUserId);
    const unsubscribe = getDoc(followingDocRef)
      .then(docSnap => {
        setIsFollowing(docSnap.exists());
      })
      .catch(error => {
        console.error("Error checking follow status:", error);
        // Potentially show a toast or handle error if needed
      })
      .finally(() => {
        setIsLoading(false);
      });
    // No need to return an unsubscribe function from getDoc promise chain.
    // If using onSnapshot, you would return its unsubscribe function.
  }, [currentUser, targetUserId]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Please log in", description: "You need to be logged in to follow users." });
      return;
    }
    if (currentUser.uid === targetUserId) {
      toast({ variant: "destructive", title: "Cannot follow yourself" });
      return;
    }
    if (isProcessingFollow) return;

    startFollowTransition(async () => {
      const batch = writeBatch(db);
      const currentUserRef = doc(db, "users", currentUser.uid);
      const targetUserRef = doc(db, "users", targetUserId);
      const currentUserFollowingDocRef = doc(currentUserRef, "following", targetUserId);
      const targetUserFollowerDocRef = doc(targetUserRef, "followers", currentUser.uid);

      try {
        if (isFollowing) { // Unfollow
          batch.delete(currentUserFollowingDocRef);
          batch.delete(targetUserFollowerDocRef);
          batch.update(currentUserRef, { followingCount: increment(-1) });
          batch.update(targetUserRef, { followersCount: increment(-1) });
          
          await batch.commit();
          setIsFollowing(false);
          toast({ title: "Unfollowed", description: `You are no longer following this user.` });
        } else { // Follow
          batch.set(currentUserFollowingDocRef, { followedAt: serverTimestamp() });
          batch.set(targetUserFollowerDocRef, { followedAt: serverTimestamp() });
          batch.update(currentUserRef, { followingCount: increment(1) });
          batch.update(targetUserRef, { followersCount: increment(1) });

          await batch.commit();
          setIsFollowing(true);
          toast({ title: "Followed!", description: `You are now following this user.` });
        }
      } catch (error: any) {
        console.error("Error toggling follow:", error);
        let errorDesc = "Could not update follow status. Please try again.";
        if (error.code === "permission-denied") {
          errorDesc = "Follow action failed due to Firestore permissions. Ensure rules allow managing follow subcollections and updating counts.";
        }
        toast({ variant: "destructive", title: "Follow Action Failed", description: errorDesc, duration: 9000 });
      }
    });
  };

  if (isLoading) {
    return <Button variant="outline" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</Button>;
  }

  if (!currentUser || currentUser.uid === targetUserId) {
    return null; // Don't show button if no current user or it's their own profile
  }

  return (
    <Button 
      onClick={handleFollowToggle} 
      disabled={isProcessingFollow}
      variant={isFollowing ? "outline" : "default"}
      className="w-full max-w-xs mx-auto"
    >
      {isProcessingFollow ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="mr-2 h-4 w-4" />
      ) : (
        <UserPlus className="mr-2 h-4 w-4" />
      )}
      {isProcessingFollow ? (isFollowing ? 'Unfollowing...' : 'Following...') : (isFollowing ? 'Following' : 'Follow')}
    </Button>
  );
}
