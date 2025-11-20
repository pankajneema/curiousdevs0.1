import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContactPopup } from "@/components/ContactPopup";
import { Users, Award, Clock, Target } from "lucide-react";

const stats = [
  { icon: Users, label: "Team Members", value: "5+" },
  { icon: Award, label: "Ideas in Motion", value: "10+" },
  { icon: Clock, label: "Founded In", value: "2025" },
  { icon: Target, label: "Vision Focus", value: "100%" }
];

export function About() {
  const [showContactPopup, setShowContactPopup] = useState(false);

  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">CuriousDevs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We’re a fresh startup with big dreams—crafting the future, one line of code at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Every Great Tech Company Starts With Curiosity
            </h3>

            <p className="text-muted-foreground leading-relaxed">
              CuriousDevs was born out of a shared passion for technology, creativity, and solving real-world problems. 
              Though we're new to the game, we’re committed to building high-quality digital solutions that matter.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              We may not have clients yet, but we’re actively developing projects, learning fast, and building a team that’s ready to take on tomorrow’s challenges.
            </p>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">What We're Focused On:</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Building in public and sharing our journey
                </li>
                <li className="flex items-center text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Learning from real-world challenges
                </li>
                <li className="flex items-center text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Building MVPs, internal tools, and open-source ideas
                </li>
                <li className="flex items-center text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Preparing to serve our first real clients with quality and care
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Button variant="outline" size="lg" asChild>
                <Link to="/future-projects">See What We’re Building</Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-gradient-card border-border/50 hover:shadow-large transition-all duration-300">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 bg-gradient-card border-border/50">
            <CardContent className="p-0">
              <h4 className="text-xl font-bold text-foreground mb-4">Our Mission</h4>
              <p className="text-muted-foreground leading-relaxed">
                To turn ideas into impact by building thoughtful, clean, and scalable digital products that solve real problems.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 bg-gradient-card border-border/50">
            <CardContent className="p-0">
              <h4 className="text-xl font-bold text-foreground mb-4">Our Vision</h4>
              <p className="text-muted-foreground leading-relaxed">
                To grow from a small startup into a trusted tech company that empowers businesses and communities through innovation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ContactPopup 
        isOpen={showContactPopup}
        onClose={() => setShowContactPopup(false)}
      />
    </section>
  );
}
