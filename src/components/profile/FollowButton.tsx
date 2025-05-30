
"use client";

import { useState, useEffect, useTransition } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, updateDoc, increment, serverTimestamp, writeBatch, onSnapshot, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';

interface FollowButtonProps {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For initial auth and follow status check
  const [isProcessingFollow, startFollowTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setIsFollowing(false);
        setIsLoading(false); // No user, so no follow status to check
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser || !targetUserId) {
      setIsLoading(false);
      setIsFollowing(false); // Reset if no current user or target
      return;
    }

    if (currentUser.uid === targetUserId) {
      setIsLoading(false); // User cannot follow themselves
      setIsFollowing(false);
      return;
    }

    setIsLoading(true);
    // Listen to the current user's "following" subcollection to see if the targetUser is in it
    const followingDocRef = doc(db, "users", currentUser.uid, "following", targetUserId);
    
    const unsubscribeFirestore = onSnapshot(followingDocRef, (docSnap) => {
      setIsFollowing(docSnap.exists());
      setIsLoading(false);
    }, (error) => {
      console.error("Error checking follow status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not check follow status. Please try again.",
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
      toast({ variant: "default", title: "Action Not Allowed", description: "You cannot follow yourself." });
      return;
    }
    if (isProcessingFollow) return;

    startFollowTransition(async () => {
      const batch = writeBatch(db);
      const currentUserRef = doc(db, "users", currentUser.uid);
      const targetUserRef = doc(db, "users", targetUserId);

      // Document in current user's "following" subcollection
      const currentUserFollowingDocRef = doc(currentUserRef, "following", targetUserId);
      // Document in target user's "followers" subcollection
      const targetUserFollowerDocRef = doc(targetUserRef, "followers", currentUser.uid);

      try {
        const targetUserProfileSnap = await getDoc(targetUserRef);
        const targetUserName = targetUserProfileSnap.exists() ? (targetUserProfileSnap.data() as UserProfile).displayName || (targetUserProfileSnap.data() as UserProfile).name || "User" : "User";

        if (isFollowing) { // Action: Unfollow
          batch.delete(currentUserFollowingDocRef);
          batch.delete(targetUserFollowerDocRef);
          batch.update(currentUserRef, { followingCount: increment(-1) });
          batch.update(targetUserRef, { followersCount: increment(-1) });
          
          await batch.commit();
          // isFollowing state will update via onSnapshot
          toast({ title: "Unfollowed", description: `You are no longer following ${targetUserName}.` });
        } else { // Action: Follow
          batch.set(currentUserFollowingDocRef, { 
            followedAt: serverTimestamp(), 
            targetName: targetUserName, // Store target name for potential future use
            targetAvatar: targetUserProfileSnap.exists() ? (targetUserProfileSnap.data() as UserProfile).avatarUrl || null : null
          });
          batch.set(targetUserFollowerDocRef, { 
            followedAt: serverTimestamp(), 
            followerName: currentUser.displayName || "Anonymous",
            followerAvatar: currentUser.photoURL || null
          });
          batch.update(currentUserRef, { followingCount: increment(1) });
          batch.update(targetUserRef, { followersCount: increment(1) });

          await batch.commit();
          // isFollowing state will update via onSnapshot
          toast({ title: "Followed!", description: `You are now following ${targetUserName}.` });
        }
      } catch (error: any) {
        console.error("Error toggling follow:", error);
        let errorDesc = "Could not update follow status. Please try again.";
        if (error.code === "permission-denied" || (error.message && error.message.toLowerCase().includes("insufficient permissions"))) {
          errorDesc = "Follow action failed due to Firestore permissions. Please ensure your Firestore Security Rules allow these operations (updating 'following'/'followers' subcollections and user 'followersCount'/'followingCount').";
        }
        toast({ variant: "destructive", title: "Follow Action Failed", description: errorDesc, duration: 9000 });
      }
    });
  };

  if (isLoading) {
    return <Button variant="outline" disabled className="w-full max-w-xs mx-auto"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</Button>;
  }

  // Don't show follow button on your own profile or if not logged in
  if (!currentUser || currentUser.uid === targetUserId) {
    return null; 
  }

  return (
    <Button 
      onClick={handleFollowToggle} 
      disabled={isProcessingFollow}
      variant={isFollowing ? "outline" : "default"}
      className="w-full" // Changed from max-w-xs to w-full for better fit in StoryCard
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
