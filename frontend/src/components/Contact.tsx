import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContactPopup } from "@/components/ContactPopup";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    content: "hello@curiousdevs.com",
    description: "Send us your requirements"
  },
  {
    icon: Phone,
    title: "Call Us",
    content: "+91 8171268630",
    description: "Mon-Fri 9AM to 6PM"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    content: "Noida, India",
    description: "Schedule an appointment"
  },
  {
    icon: Clock,
    title: "Response Time",
    content: "Within 24 Hours",
    description: "Quick turnaround guaranteed"
  }
];

export function Contact() {
  const [showExitPopup, setShowExitPopup] = useState(false);

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Get In <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Ready to start your next project? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <Button 
            variant="hero" 
            size="xl"
            onClick={() => setShowExitPopup(true)}
          >
            Let's Connect
          </Button>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center p-6 bg-gradient-card border-border/50 hover:shadow-large transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <info.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{info.title}</h3>
                <p className="text-primary font-medium mb-1">{info.content}</p>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-primary/5 rounded-2xl p-12 border border-primary/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-foreground mb-2">How long does a project take?</h4>
              <p className="text-muted-foreground text-sm">Project timelines vary based on complexity. Simple websites take 1-2 weeks, while complex integrations may take 4-8 weeks.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Do you provide ongoing support?</h4>
              <p className="text-muted-foreground text-sm">Yes! We offer 24/7 support and maintenance packages to ensure your solutions run smoothly.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">What technologies do you use?</h4>
              <p className="text-muted-foreground text-sm">We use modern technologies like React, Node.js, Python, and cloud platforms like AWS and Azure.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Can you work with existing systems?</h4>
              <p className="text-muted-foreground text-sm">Absolutely! We specialize in integrations and can work with your existing CRM, databases, and business tools.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup 
        isOpen={showExitPopup} 
        onClose={() => setShowExitPopup(false)} 
      />
    </section>
  );
}