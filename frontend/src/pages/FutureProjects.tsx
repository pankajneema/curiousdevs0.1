import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, Zap, Shield, Brain, Rocket } from "lucide-react";

const futureProjects = [
  {
    icon: Brain,
    title: "AI-Powered Business Analytics",
    description: "Advanced machine learning solutions for predictive business intelligence and automated decision-making systems.",
    timeline: "Q2 2024",
    status: "In Development",
    technologies: ["Python", "TensorFlow", "React", "FastAPI"],
    category: "Artificial Intelligence"
  },
  {
    icon: Shield,
    title: "Advanced Threat Detection System",
    description: "Real-time cybersecurity monitoring with AI-driven threat detection and automated response mechanisms.",
    timeline: "Q3 2024",
    status: "Planning Phase",
    technologies: ["Python", "Elasticsearch", "React", "Docker"],
    category: "Cybersecurity"
  },
  {
    icon: Rocket,
    title: "Blockchain Integration Platform",
    description: "Comprehensive blockchain solutions for supply chain management and digital asset tracking.",
    timeline: "Q4 2024",
    status: "Research Phase",
    technologies: ["Solidity", "Web3.js", "React", "Node.js"],
    category: "Blockchain"
  },
  {
    icon: Zap,
    title: "IoT Device Management Hub",
    description: "Centralized platform for managing and monitoring IoT devices with real-time analytics and control.",
    timeline: "Q1 2025",
    status: "Concept",
    technologies: ["React", "MQTT", "InfluxDB", "Grafana"],
    category: "Internet of Things"
  }
];

const statusColors = {
  "In Development": "bg-blue-500/10 text-blue-600 border-blue-200",
  "Planning Phase": "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  "Research Phase": "bg-purple-500/10 text-purple-600 border-purple-200",
  "Concept": "bg-gray-500/10 text-gray-600 border-gray-200"
};

export default function FutureProjects() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CD</span>
              </div>
              <span className="text-xl font-bold text-foreground">CuriousDevs</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Future Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Innovative solutions and cutting-edge technologies we're developing to shape the future of business automation and digital transformation.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Roadmap 2024-2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>20+ Team Members</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {futureProjects.map((project, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-large transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <project.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className={statusColors[project.status as keyof typeof statusColors]}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{project.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Category</h4>
                      <Badge variant="secondary">{project.category}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Timeline</h4>
                      <p className="text-sm text-muted-foreground">{project.timeline}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Interested in Future Collaborations?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get early access to our upcoming projects and be part of the innovation journey.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/">Get In Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}