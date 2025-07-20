import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Star, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExitIntentPopup({ isOpen, onClose }: ExitIntentPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectName: "",
    projectType: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Phone validation
    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await apiClient.leadCreate(
            formData.name,
            formData.email,
          formData.phone,
            formData.projectName,
      formData.projectType,
        formData.message,
      );

      toast({
        title: "Request Submitted!",
        description: "We'll contact you within 24 hours to schedule your free consultation.",
      });

      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectName: "",
        projectType: "",
        message: ""
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border shadow-large animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              Ready to Grow? Let’s Connect Now
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Let us show you how our tech solutions can take your business to the next level.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Free Consultation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Expert Team</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Proven Results</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your Name*"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background border-border"
              />
              <Input
                type="email"
                placeholder="Your Email*"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background border-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Phone Number*"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[6-9]{1}[0-9]{9}"
                maxLength={10}
                inputMode="numeric"
                required
                className="bg-background border-border"
              />
              <Input
                type="text"
                placeholder="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="bg-background border-border"
              />
            </div>

            <Input
              type="text"
              placeholder="Project Type"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="bg-background border-border"
            />

            <Textarea
              placeholder="Tell us about your project (optional)"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="bg-background border-border resize-none"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                variant="hero"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Get My Free Consultation"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 sm:flex-none"
              >
                Maybe Later
              </Button>
            </div>
          </form>

          {/* Trust indicators */}
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
            <p>🔒 Your information is secure • 📞 No spam calls • ⚡ 24hr response time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
