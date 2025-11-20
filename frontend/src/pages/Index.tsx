import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { Contact } from "@/components/Contact";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

interface User {
  id: string;
  full_name: string;
  phone: string;
  location: string;
  role: 'admin' | 'customer';
}

interface IndexProps {
  user?: User | null;
  onLogout?: () => void;
}

const Index = ({ user, onLogout }: IndexProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/687bf0135927551915d70b3e/1j0i23jot";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={onLogout} />
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Newsletter />
      <Contact />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CD</span>
              </div>
              <span className="text-xl font-bold text-foreground">CuriousDevs</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Transforming businesses through innovative technology solutions
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 CuriousDevs.com. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Exit Intent Popup */}
      {/* <ExitIntentPopup 
        isOpen={showExitPopup} 
        onClose={() => setShowExitPopup(false)} 
      /> */}
    </div>
  );
};

export default Index;
