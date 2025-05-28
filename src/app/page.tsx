
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StoryProgressTracker from "@/components/dashboard/StoryProgressTracker";
import DailyPromptCard from "@/components/dashboard/DailyPromptCard";
import CreativeToolbox from "@/components/dashboard/CreativeToolbox";
import AchievementsPanel from "@/components/dashboard/AchievementsPanel";
import FeaturedStoryCarousel from "@/components/dashboard/FeaturedStoryCarousel";
import LearningBuddyCorner from "@/components/dashboard/LearningBuddyCorner";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 space-y-8 min-h-screen">
      
      <WelcomeSection />

      <Separator className="my-8 bg-primary/20"/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        <div className="lg:col-span-2 space-y-6 xl:space-y-8">
          <StoryProgressTracker />
          <DailyPromptCard />
        </div>
        <div className="space-y-6 xl:space-y-8">
          <CreativeToolbox />
          <AchievementsPanel />
        </div>
      </div>
      
      <Separator className="my-8 bg-primary/20"/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 items-start">
        <LearningBuddyCorner />
        {/* Placeholder for another potential widget or can be left for FeaturedStoryCarousel to span if needed */}
        <div className="md:col-span-1 hidden md:block"> {/* Empty div for spacing, or another component */} </div>
      </div>
      
      <Separator className="my-8 bg-primary/20"/>
      
      <FeaturedStoryCarousel />

    </div>
  );
}
