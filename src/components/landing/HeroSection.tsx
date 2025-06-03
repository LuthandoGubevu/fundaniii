
"use client";

import Link from "next/link";
import Image from "next/image"; // Added Image import
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 lg:py-40 text-center overflow-hidden min-h-[calc(80vh)] flex flex-col items-center justify-center">
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Logo Added Here */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/Fundees.png" // Assuming Fundees.png is in the /public directory
            alt="Fundees Logo"
            width={250} // Adjust width as needed
            height={100} // Adjust height as needed, will maintain aspect ratio
            priority // Load the logo with high priority
            data-ai-hint="company logo"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-800"> {/* Reduced text sizes here */}
          Turn Imagination into <span className="text-[#29ABE2]">Stories</span> with{" "}
          <span className="text-yellow-500">Fundees</span>!
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-gray-600">
          A fun, safe space where young learners create, share, and explore
          stories with the help of AI.
        </p>
        <div className="mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold text-lg shadow-lg transform transition-transform duration-150 hover:scale-105 active:scale-95 animate-bounce"
            style={{animationIterationCount: 3, animationDelay: '1s'}}
          >
            <Link href="/auth/signup">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
