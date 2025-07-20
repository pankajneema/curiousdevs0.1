import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  LogOut, 
  User as UserIcon, 
  Plus, 
  Calendar, 
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  Phone
} from "lucide-react";
import { apiClient, User, Project, ContactRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ContactPopup } from "@/components/ContactPopup";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [user.role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user.role === 'admin') {
        // Fetch all projects and contacts for admin
        const [projectsData, contactsData] = await Promise.all([
          apiClient.getProjects(),
          apiClient.getContactRequests()
        ]);
        
        setProjects(projectsData);
        setContactRequests(contactsData);
      } else {
        // Fetch only user's projects for customer
        const projectsData = await apiClient.getProjects();
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'request send': return 'outline';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status.toLowerCase()) {
      case 'request send': return 25;
      case 'pending': return 25;
      case 'in_progress': return 60;
      case 'completed': return 100;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Welcome back, {user.full_name}!
                </h1>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.role} Dashboard
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {user.role === 'admin' ? (
          // Admin Dashboard
          <div className="space-y-8">
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border shadow-soft hover:shadow-large transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                      <p className="text-3xl font-bold text-foreground">{projects.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        All time
                      </p>
                    </div>
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft hover:shadow-large transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                      <p className="text-3xl font-bold text-foreground">
                        {projects.filter(p => p.status === 'in_progress').length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        In progress
                      </p>
                    </div>
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <Clock className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft hover:shadow-large transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact Requests</p>
                      <p className="text-3xl font-bold text-foreground">{contactRequests.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Users className="w-3 h-3 inline mr-1" />
                        Total requests
                      </p>
                    </div>
                    <div className="bg-purple-500/10 p-3 rounded-lg">
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft hover:shadow-large transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                      <p className="text-3xl font-bold text-foreground">
                        ₹{projects.reduce((sum, p) => sum + (p.total_amount || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <IndianRupee className="w-3 h-3 inline mr-1" />
                        Total earned
                      </p>
                    </div>
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      <IndianRupee className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Table */}
            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  All Projects
                </CardTitle>
                <CardDescription>Manage all customer projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-foreground">{project.title}</h3>
                          <Badge variant={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Type: {project.service_type}</span>
                          <span>Amount: ₹{project.total_amount?.toLocaleString() || 0}</span>
                          <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                        <Progress value={getStatusProgress(project.status)} className="mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Customer Dashboard
          <div className="space-y-8">
            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border shadow-soft hover:shadow-large transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">My Projects</p>
                      <p className="text-3xl font-bold text-foreground">{projects.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <FileText className="w-3 h-3 inline mr-1" />
                        Total projects
                      </p>
                    </div>
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft hover:shadow-large transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                      <p className="text-3xl font-bold text-foreground">
                        ₹{projects.reduce((sum, p) => sum + (p.total_amount || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <IndianRupee className="w-3 h-3 inline mr-1" />
                        All projects
                      </p>
                    </div>
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <IndianRupee className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft hover:shadow-large transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-3xl font-bold text-foreground">
                        {projects.filter(p => p.status === 'completed').length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Finished projects
                      </p>
                    </div>
                    <div className="bg-purple-500/10 p-3 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Projects */}
            <Card className="border-border shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    My Projects
                  </CardTitle>
                  <CardDescription>Your current and completed projects</CardDescription>
                </div>
                <Button 
                  onClick={() => setShowContactPopup(true)}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Request Project
                </Button>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-6">Request your first project to get started!</p>
                    <Button 
                      onClick={() => setShowContactPopup(true)}
                      className="shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Request Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-foreground">{project.title}</h3>
                            <Badge variant={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                            <span>Type: {project.service_type}</span>
                            <span>Amount: ₹{project.total_amount?.toLocaleString() || 0}</span>
                            <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                          </div>
                          <Progress value={getStatusProgress(project.status)} className="mb-2" />
                          <p className="text-xs text-muted-foreground">
                            Progress: {getStatusProgress(project.status)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Card */}
            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-foreground">{user.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-foreground">{user.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                    <p className="text-foreground">{user.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <ContactPopup 
        isOpen={showContactPopup} 
        onClose={() => setShowContactPopup(false)} 
        user={user}
      />
    </div>
  );
};

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return <label className={className} {...props}>{children}</label>;
}

export default Dashboard;