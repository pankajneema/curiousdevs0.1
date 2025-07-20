import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactPopup } from "@/components/ContactPopup";
import { 
  Globe, 
  Database, 
  Code, 
  Zap, 
  CloudSun, 
  Brain,
  CheckCircle,
  ArrowRight,
  Shield,
  Search,
  Server,
  CloudMoon,
  CloudCog

} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description: "Custom responsive websites built with modern frameworks",
    features: ["React/Next.js", "REST APIs", "SEO Optimized", "Fast Loading"],
    color: "bg-gradient-primary"
  },
  {
    icon: Database,
    title: "CRM Integration", 
    description: "Connect and automate your customer relationship management",
    features: ["Salesforce", "HubSpot", "Custom APIs", "Data Migration"],
    color: "bg-gradient-hero"
  },
   {
    icon: Zap,
    title: "Third-Party Integration",
    description: "Seamlessly connect different platforms and services",
    features: ["Payment Gateways", "Social Media APIs", "Email/Whatsapp Marketing", "Analytics Tools"],
    color: "bg-brand-orange"
  },
    {
    icon: Brain,
    title: "AI & Machine Learning",
    description: "Intelligent solutions powered by artificial intelligence",
    features: ["Custom AI Models", "Data Analytics", "Predictive Analytics", "NLP Solutions"],
    color: "bg-accent"
  },
  {
    icon: Code,
    title: "Custom Scripts",
    description: "Automation scripts to streamline your business processes",
    features: ["Python/JavaScript", "API Integration", "Data Processing", "Workflow Automation"],
    color: "bg-brand-purple"
  },
  {
    icon: Search,
    title: "Data Scraping",
    description: "Extract valuable data from websites and APIs",
    features: ["Web Scraping", "Data Cleaning", "Regular Updates", "Custom Formats"],
    color: "bg-accent"
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Comprehensive security solutions to protect your digital assets",
    features: ["Penetration Testing", "Threat Management", "Security Audits", "Vulnerability Assessment"],
    color: "bg-brand-red"
  },
  {
    icon: Server,
    title: "MCP Server",
    description: "Model Context Protocol server implementation and integration",
    features: ["Custom MCP Servers", "Protocol Integration", "AI Tool Integration", "Context Management"],
    color: "bg-brand-blue"
  },
  {
    icon: CloudMoon,
    title: "Cloud Solutions",
    description: "Modern cloud infrastructure and deployment strategies",
    features: ["AWS/Azure/GCP", "DevOps", "CI/CD Pipelines", "Microservices"],
    color: "bg-gradient-primary"
  }
];

export function Services() {
  const [showContactPopup, setShowContactPopup] = useState(false);

  return (
    <section id="services" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We offer comprehensive tech solutions to help your business thrive in the digital world
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-large transition-all duration-300 border-border/50 hover:border-primary/20 bg-gradient-card">
              <CardHeader>
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <ContactPopup 
        isOpen={showContactPopup}
        onClose={() => setShowContactPopup(false)}
      />
    </section>
  );
}