
"use client";

import type { UserProfile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import FollowButton from "@/components/profile/FollowButton";
import { Users } from "lucide-react";

interface UserCardProps {
  user: UserProfile;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/70 hover:border-primary text-card-foreground">
      <CardHeader className="items-center text-center p-4">
        <Link href={`/profile/${user.uid}`}>
          <Image
            src={user.avatarUrl || `https://placehold.co/100x100.png?text=${(user.name || 'U').charAt(0)}`}
            alt={user.displayName || user.name || "User Avatar"}
            width={80}
            height={80}
            className="rounded-full border-2 border-primary-foreground shadow-md object-cover mb-2"
            data-ai-hint="user avatar small"
          />
        </Link>
        <CardTitle className="text-lg font-semibold">
          <Link href={`/profile/${user.uid}`} className="hover:underline">
            {user.displayName || user.name}
          </Link>
        </CardTitle>
        {user.grade && (
          <CardDescription className="text-xs text-muted-foreground">
            {user.grade}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4 text-center">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-1.5" />
          {user.followersCount || 0} Followers
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <FollowButton targetUserId={user.uid} />
      </CardFooter>
    </Card>
  );
}
