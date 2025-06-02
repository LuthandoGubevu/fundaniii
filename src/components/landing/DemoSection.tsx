
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const demoImages = [
  { src: "https://placehold.co/600x400.png?text=Story+Builder+UI", alt: "Fundees Story Builder Interface", dataAiHint: "app screenshot story editor" },
  { src: "https://placehold.co/600x400.png?text=User+Profile+Page", alt: "Fundees User Profile Page", dataAiHint: "app screenshot user profile" },
  { src: "https://placehold.co/600x400.png?text=Story+Library+View", alt: "Fundees Story Library", dataAiHint: "app screenshot story library" },
];

export default function DemoSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            See <span className="text-yellow-500">Fundees</span> in Action!
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A sneak peek into our magical world of stories.
          </p>
        </div>
        {/* Simplified static display instead of a carousel for now */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demoImages.map((image, index) => (
            <Card key={index} className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  data-ai-hint={image.dataAiHint}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center mt-8 text-gray-500 text-sm">
            (Illustrative purposes - actual UI may vary. Interactive carousel coming soon!)
        </p>
      </div>
    </section>
  );
}
