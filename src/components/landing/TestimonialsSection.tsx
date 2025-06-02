
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Fundees made my child excited about writing! The AI guide is fantastic for overcoming writer's block.",
    name: "Mrs. Thabo, Parent",
    stars: 5,
  },
  {
    quote: "As a teacher, I love how Fundees encourages creativity and literacy in such a fun and safe environment.",
    name: "Mr. David, Grade 3 Teacher",
    stars: 5,
  },
  {
    quote: "My kids can't get enough of creating stories and reading what other children have written. Highly recommend!",
    name: "Aisha K., Guardian",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-sky-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Loved by Parents & <span className="text-green-500">Educators</span>!
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg rounded-xl bg-white p-6">
              <CardContent className="flex flex-col items-center text-center">
                <div className="flex mb-3">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-600">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
