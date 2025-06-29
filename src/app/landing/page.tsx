
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
// import DemoSection from "@/components/landing/DemoSection"; // Removed DemoSection import
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CallToActionSection from "@/components/landing/CallToActionSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      {/* <DemoSection /> */} {/* Removed DemoSection component */}
      <TestimonialsSection />
      <CallToActionSection />
      <LandingFooter />
    </div>
  );
}
