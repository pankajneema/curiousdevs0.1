import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

const testimonials = [
  {
    name: "Anjali Mehra",
    company: "Early Supporter",
    role: "Product Enthusiast",
    content:
      "Even in the early days, you can feel the spark in CuriousDevs. The passion, the clarity, and the heart behind their work is rare and inspiring.",
    rating: 5,
    avatar: "AM"
  },
  {
    name: "Ravi Joshi",
    company: "Tech Community",
    role: "Developer",
    content:
      "Watching a startup build with transparency and purpose is refreshing. CuriousDevs is not just making code — they're crafting impact.",
    rating: 4,
    avatar: "RJ"
  },
  {
    name: "CuriousDevs Team",
    company: "Founders’ Note",
    role: "Our Journey",
    content:
      "We don’t have clients yet. But we have courage, a vision, and a team that shows up every single day to build something meaningful. This is just the beginning.",
    rating: 5,
    avatar: "CD"
  }
];

export function Testimonials() {
  const [showExitPopup, setShowExitPopup] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-r from-secondary/5 via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Early <span className="bg-gradient-primary bg-clip-text text-transparent">Voices</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            CuriousDevs is a young startup with a bold vision. We may not have clients yet, but we have heart, hustle, and people who believe in us.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Every great journey begins with belief—and this is ours.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-gradient-card border-border/50 hover:shadow-large transition-all duration-300 group"
            >
              <CardContent className="p-8">
                {/* Stars + Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-primary/30" />
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Avatar & Name */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA: Want to be part of our story? */}
        <div className="text-center mt-24">
          <p className="text-lg sm:text-xl text-muted-foreground mb-6">
            Want to be part of our story? Whether you're a potential client, collaborator, or just curious—let's talk.
          </p>
          <Button size="lg" onClick={() => setShowExitPopup(true)}>
            Connect With Us
          </Button>
        </div>
      </div>

      {/* Contact Popup */}
      <ExitIntentPopup 
              isOpen={showExitPopup} 
              onClose={() => setShowExitPopup(false)} 
      />
    </section>
  );
}
