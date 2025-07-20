import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient, User } from "@/lib/api";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export function ContactPopup({ isOpen, onClose, user }: ContactPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    serviceType: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (user) {
      // Logged-in user → Save to projects
      const project = await apiClient.createProject({
        title: formData.title,
        service_type: formData.serviceType,
        description: formData.description
      });

      const projectSummary = `Hi, I am ${user.full_name}
            
      📋 Project Details:
      • Title: ${formData.title}
      • Service: ${formData.serviceType}
      • Description: ${formData.description}
      • Customer: ${user.full_name}
      • Phone: ${user.phone}
      • Location: ${user.location}
      • Status: Request Send

      Looking forward to working with you!`;

      toast({
        title: "Project Request Submitted Successfully! 🎉",
        description: (
          <div className="mt-2">
            <p className="mb-2">Your project has been submitted with initial status "Request Send"</p>
            <Button
              size="sm"
              onClick={() => {
                const whatsappUrl = `https://wa.me/918171268630?text=${encodeURIComponent(projectSummary)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Phone className="w-4 h-4 mr-2" />
              Send to WhatsApp
            </Button>
          </div>
        ),
      });
    } else {
      // Guest user → Create lead
     const pnkj  =  await apiClient.leadCreate(
        formData.name,
        formData.email,
        formData.phone,
        formData.title,
        formData.serviceType,
        formData.description
      );
     console.log("PANKAJJJJJJJJJJJJ ===:  ",pnkj);
      toast({
        title: "Lead Submitted Successfully!",
        description: "Our team will contact you soon.",
      });
    }

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      title: "",
      serviceType: "",
      description: ""
    });
    onClose();

  } catch (error: any) {
  console.log("Full error object:", error);
    toast({
      title: "Error",
      description: error.message ||  "Something went wrong. Please try again.",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center justify-between">
            Request a Project
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {user ? 
              "Tell us about your project requirements and we'll get back to you." :
              "Fill out the form below and we'll get back to you within 24 hours."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!user && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              placeholder="E.g., E-commerce Website, Mobile App"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web_development">Web Development</SelectItem>
                <SelectItem value="mobile_app">Mobile App Development</SelectItem>
                <SelectItem value="ecommerce">E-commerce Solution</SelectItem>
                <SelectItem value="crm">CRM System</SelectItem>
                <SelectItem value="api_integration">API Integration</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us more about your project requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}