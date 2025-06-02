
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function CallToActionSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Sparkles className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
          Ready to Unleash Your Inner Storyteller?
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-gray-600">
          Join Fundees today and start creating your first magical story. It's free to get started!
        </p>
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="bg-[#29ABE2] hover:bg-[#238dbb] text-white font-semibold text-lg shadow-lg transform transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            <Link href="/auth/signup">
              Create Your Account Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
