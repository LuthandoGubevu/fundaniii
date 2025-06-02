
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, BookOpenText, Languages, Users, Award } from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "Create Your Own Story with AI",
    description: "Our friendly AI helps spark ideas and guide your storytelling adventure.",
    color: "text-sky-500",
    bgColor: "bg-sky-100",
  },
  {
    icon: BookOpenText,
    title: "Explore Stories from Other Kids",
    description: "Read amazing tales created by young authors from around the world.",
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    icon: Languages,
    title: "Translate Stories into Any Language",
    description: "Share your stories and read others in many different languages.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
  {
    icon: Users,
    title: "Follow Friends and Share",
    description: "Connect with fellow storytellers and see what they create.",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    icon: Award,
    title: "Earn Badges & Rewards",
    description: "Unlock cool badges as you write, read, and explore.",
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            What Makes <span className="text-[#29ABE2]">Fundees</span> Awesome?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to become a superstar storyteller!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardHeader className="items-center text-center">
                <div className={`p-4 rounded-full ${feature.bgColor} mb-4`}>
                  <feature.icon className={`h-10 w-10 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-700">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
