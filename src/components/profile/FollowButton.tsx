
"use client";

import { useState, useEffect, useTransition } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, updateDoc, increment, serverTimestamp, writeBatch, onSnapshot } from 'firebase/firestore';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingFollow, startFollowTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setIsFollowing(false);
        setIsLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser || !targetUserId || currentUser.uid === targetUserId) {
      setIsLoading(false);
      setIsFollowing(false); // Ensure isFollowing is false if no current user or it's their own profile
      return;
    }

    setIsLoading(true);
    const followingDocRef = doc(db, "users", currentUser.uid, "following", targetUserId);
    
    const unsubscribeFirestore = onSnapshot(followingDocRef, (docSnap) => {
      setIsFollowing(docSnap.exists());
      setIsLoading(false);
    }, (error) => {
      console.error("Error checking follow status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not check follow status.",
      });
      setIsLoading(false);
    });
    
    return () => unsubscribeFirestore();
  }, [currentUser, targetUserId, toast]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Please log in", description: "You need to be logged in to follow users." });
      return;
    }
    if (currentUser.uid === targetUserId) {
      toast({ variant: "destructive", title: "Action Not Allowed", description: "You cannot follow yourself." });
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
          // setIsFollowing(false); // Optimistic update handled by onSnapshot
          toast({ title: "Unfollowed", description: `You are no longer following this user.` });
        } else { // Follow
          batch.set(currentUserFollowingDocRef, { followedAt: serverTimestamp(), targetName: "Unknown User" /* Consider fetching target user's name */ });
          batch.set(targetUserFollowerDocRef, { followedAt: serverTimestamp(), followerName: currentUser.displayName || "Anonymous" });
          batch.update(currentUserRef, { followingCount: increment(1) });
          batch.update(targetUserRef, { followersCount: increment(1) });

          await batch.commit();
          // setIsFollowing(true); // Optimistic update handled by onSnapshot
          toast({ title: "Followed!", description: `You are now following this user.` });
        }
      } catch (error: any) {
        console.error("Error toggling follow:", error);
        let errorDesc = "Could not update follow status. Please try again.";
        if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("insufficient permissions"))) {
          errorDesc = "Follow action failed due to Firestore permissions. Please check your Firestore Security Rules to ensure you can update 'following' subcollections and user 'followersCount'/'followingCount'.";
        }
        toast({ variant: "destructive", title: "Follow Action Failed", description: errorDesc, duration: 9000 });
      }
    });
  };

  if (isLoading) {
    return <Button variant="outline" disabled className="w-full max-w-xs mx-auto"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</Button>;
  }

  if (!currentUser || currentUser.uid === targetUserId) {
    return null; 
  }

  return (
    <Button 
      onClick={handleFollowToggle} 
      disabled={isProcessingFollow || isLoading}
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
