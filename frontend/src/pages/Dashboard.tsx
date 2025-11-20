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
  Phone,
  Eye,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient, User, Project, ContactRequest, Bill } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ContactPopup } from "@/components/ContactPopup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [user.role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user.role === 'admin') {
        // Fetch all projects for admin
        const projectsData = await apiClient.getProjects();
        setProjects(projectsData || []);
        
        // Try to fetch contacts, but don't fail if endpoint doesn't exist
        try {
          const contactsData = await apiClient.getContactRequests();
          setContactRequests(contactsData || []);
        } catch (err) {
          console.log('Contact requests endpoint not available');
          setContactRequests([]);
        }
      } else {
        // Fetch only user's projects for customer
        const [projectsData, billsData] = await Promise.all([
          apiClient.getProjects(),
          apiClient.getMyBills().catch(() => [])
        ]);
        setProjects(projectsData || []);
        setBills(billsData || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch data. Please check your connection.",
        variant: "destructive",
      });
      // Set empty arrays on error so page still renders
      setProjects([]);
      setContactRequests([]);
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

  const getStatusProgress = (project: Project) => {
    if (project.progress_percentage !== undefined) {
      return project.progress_percentage;
    }
    switch (project.status?.toLowerCase()) {
      case 'request send':
      case 'pending': return 25;
      case 'in_progress':
      case 'ongoing':
      case 'accepted': return 60;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (statusFilter === "all") return true;
    return project.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const projectStats = {
    total: projects.length,
    pending: projects.filter((p) => p.status?.toLowerCase() === "pending").length,
    accepted: projects.filter((p) => p.status?.toLowerCase() === "accepted").length,
    ongoing: projects.filter((p) => 
      p.status?.toLowerCase() === "in_progress" || 
      p.status?.toLowerCase() === "ongoing"
    ).length,
    completed: projects.filter((p) => p.status?.toLowerCase() === "completed").length,
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
                        ₹{projects.reduce((sum, p) => sum + (p.project_amount || 0), 0).toLocaleString()}
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
                {/* Status Filter */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === "accepted" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("accepted")}
                  >
                    Accepted
                  </Button>
                  <Button
                    variant={statusFilter === "ongoing" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("ongoing")}
                  >
                    Ongoing
                  </Button>
                  <Button
                    variant={statusFilter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("completed")}
                  >
                    Completed
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No projects found</p>
                    </div>
                  ) : (
                    filteredProjects.map((project) => (
                      <div key={project.id} className="p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-foreground text-lg">{project.title}</h3>
                              <div className="flex gap-2">
                                <Badge variant={getStatusColor(project.status || "")}>
                                  {project.status}
                                </Badge>
                                {project.payment_status === "paid" && (
                                  <Badge variant="default">Paid</Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                              <span>Type: {project.service_type?.replace("_", " ") || "N/A"}</span>
                              <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                              <span>Progress: {getStatusProgress(project)}%</span>
                            </div>
                            <Progress value={getStatusProgress(project)} className="mb-3" />
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/project/${project.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/project/${project.id}`, { state: { tab: "messages" } })}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                      <p className="text-sm font-medium text-muted-foreground">Total Project Amount</p>
                      <p className="text-3xl font-bold text-foreground">
                        ₹{projects.reduce((sum, p) => sum + (p.project_amount || 0), 0).toLocaleString()}
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
                      <p className="text-sm font-medium text-muted-foreground">Pending Payment</p>
                      <p className="text-3xl font-bold text-foreground">
                        ₹{projects.reduce((sum, p) => {
                          const amount = p.project_amount || 0;
                          const paid = p.paid_amount || 0;
                          return sum + (amount - paid);
                        }, 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        Remaining payment
                      </p>
                    </div>
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      <AlertCircle className="h-8 w-8 text-orange-500" />
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

            {/* Project Stats */}
            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{projectStats.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{projectStats.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{projectStats.accepted}</p>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{projectStats.ongoing}</p>
                    <p className="text-sm text-muted-foreground">Ongoing</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{projectStats.completed}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                {/* Status Filter */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === "accepted" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("accepted")}
                  >
                    Accepted
                  </Button>
                  <Button
                    variant={statusFilter === "ongoing" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("ongoing")}
                  >
                    Ongoing
                  </Button>
                  <Button
                    variant={statusFilter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("completed")}
                  >
                    Completed
                  </Button>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {projects.length === 0 ? "No projects yet" : "No projects with this status"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {projects.length === 0 
                        ? "Request your first project to get started!"
                        : "Try selecting a different status filter"}
                    </p>
                    {projects.length === 0 && (
                      <Button 
                        onClick={() => setShowContactPopup(true)}
                        className="shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Request Project
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-foreground text-lg">{project.title}</h3>
                              <div className="flex gap-2">
                                <Badge variant={getStatusColor(project.status || "")}>
                                  {project.status}
                                </Badge>
                                {project.payment_status === "paid" && (
                                  <Badge variant="default">Paid</Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                              <span>Type: {project.service_type?.replace("_", " ") || "N/A"}</span>
                              <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                              {project.project_amount && project.project_amount > 0 && (
                                <>
                                  <span className="font-semibold text-foreground">
                                    Amount: ₹{project.project_amount.toLocaleString()}
                                  </span>
                                  {project.paid_amount !== undefined && (
                                    <span className={project.paid_amount < project.project_amount ? "text-orange-500" : "text-green-500"}>
                                      Paid: ₹{project.paid_amount.toLocaleString()}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <Progress value={getStatusProgress(project)} className="mb-2" />
                            <p className="text-xs text-muted-foreground mb-3">
                              Progress: {getStatusProgress(project)}%
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/project/${project.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/project/${project.id}`, { state: { tab: "messages" } })}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Information */}
              <Card className="border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
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

              {/* Curious Points & Billing */}
              <Card className="border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Curious Points & Billing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Curious Points */}
                    <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Curious Points</p>
                          <p className="text-2xl font-bold text-primary mt-1">
                            {projects.length * 100}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Earned from projects
                          </p>
                        </div>
                        <div className="bg-primary/20 p-3 rounded-lg">
                          <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Billing Summary */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Billing Summary</Label>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Projects:</span>
                          <span className="font-medium">{projects.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-medium">
                            ₹{projects.reduce((sum, p) => sum + (p.project_amount || 0), 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Paid Amount:</span>
                          <span className="font-medium text-green-500">
                            ₹{projects.reduce((sum, p) => sum + (p.paid_amount || 0), 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-muted-foreground">Pending:</span>
                          <span className="font-medium text-orange-500">
                            ₹{projects.reduce((sum, p) => {
                              const amount = p.project_amount || 0;
                              const paid = p.paid_amount || 0;
                              return sum + (amount - paid);
                            }, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Billing History */}
            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Billing History
                </CardTitle>
                <CardDescription>Your payment history for all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <BillingHistory user={user} projects={projects} />
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

// Billing History Component
const BillingHistory = ({ user, projects }: { user: User; projects: Project[] }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const billsData = await apiClient.getMyBills();
        setBills(billsData || []);
      } catch (error) {
        console.error("Failed to fetch bills:", error);
        setBills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  // Combine bills with project info
  const billingData = bills.map(bill => {
    const project = projects.find(p => p.id === bill.project_id);
    return {
      ...bill,
      project_title: project?.title || "Unknown Project",
      project_amount: project?.project_amount || bill.amount
    };
  });

  if (loading) {
    return <p className="text-muted-foreground">Loading billing history...</p>;
  }

  if (billingData.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">No billing history yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {billingData.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell>
                {new Date(bill.issued_on).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">{bill.project_title}</TableCell>
              <TableCell>₹{bill.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={bill.status === "paid" ? "default" : "outline"}>
                  {bill.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return <label className={className} {...props}>{children}</label>;
}

export default Dashboard;