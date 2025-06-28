
import { Suspense } from 'react';
import CreateStoryClientPage from "@/components/story/CreateStoryClientPage";
import { Loader2 } from 'lucide-react';

export default function CreateStoryPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center text-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading Story Creator...</p>
      </div>
    }>
      <CreateStoryClientPage />
    </Suspense>
  );
}
