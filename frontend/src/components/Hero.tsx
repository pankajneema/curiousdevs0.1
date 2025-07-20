import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactPopup } from "@/components/ContactPopup";
import { ArrowRight, Code, Database, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  const [showContactPopup, setShowContactPopup] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-primary rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-hero rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-primary/10 rounded-full text-primary font-medium text-sm mb-8 border border-primary/20">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Professional Tech Solutions
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            We Build
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Amazing </span>
            Digital Solutions
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            From custom websites to complex integrations, we transform your ideas into powerful digital experiences. 
            Specializing in CRM integrations, automation, and cutting-edge web development.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full sm:w-auto"
              onClick={() => setShowContactPopup(true)}
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              View Our Work
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Web Development</h3>
              <p className="text-muted-foreground text-center">Custom websites and web applications built with modern technologies</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">CRM Integration</h3>
              <p className="text-muted-foreground text-center">Seamless integration with your existing business systems</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-brand-purple rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Automation</h3>
              <p className="text-muted-foreground text-center">Custom scripts and automation to streamline your workflow</p>
            </div>
          </div>
        </div>
      </div>
      
      <ContactPopup 
        isOpen={showContactPopup}
        onClose={() => setShowContactPopup(false)}
        title="Start Your Project"
        description="Tell us about your project and we'll provide a custom solution for your needs."
      />
    </section>
  );
}