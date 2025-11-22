import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Code,
  Users,
  MessageSquare,
  ExternalLink,
  CreditCard,
  Send,
  Edit,
  Save
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiClient, User, Project, Message } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectDetailProps {
  user: User;
}

const ProjectDetail = ({ user }: ProjectDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    tech_stack: [] as string[],
    progress_percentage: 0,
    demo_link: "",
    payment_link: "",
    payment_status: "",
    phases: [] as any[],
    project_amount: 0 as number
  });
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchMessages();
    }
  }, [id]);

  useEffect(() => {
    if (project && user.role === "admin") {
      setEditData({
        status: project.status || "",
        tech_stack: project.tech_stack || [],
        progress_percentage: project.progress_percentage || 0,
        demo_link: project.demo_link || "",
        payment_link: project.payment_link || "",
        payment_status: project.payment_status || "unpaid",
        phases: project.phases || [],
        project_amount: project.project_amount || 0
      } as any);
    }
  }, [project, user.role]);

  const fetchProject = async () => {
    try {
      const data = await apiClient.getProjectDetails(id!);
      setProject(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch project details",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await apiClient.getProjectMessages(id!);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      await apiClient.sendProjectMessage(id!, newMessage);
      setNewMessage("");
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
      fetchMessages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handlePayment = async () => {
    if (!project) return;
    
    const remaining = (project.project_amount || 0) - (project.paid_amount || 0);
    if (remaining <= 0) {
      toast({
        title: "Already Paid",
        description: "This project is already fully paid.",
      });
      return;
    }
    
    setShowPaymentDialog(true);
  };

  const processPayment = async () => {
    if (!project) return;
    
    setProcessingPayment(true);
    try {
      const response = await apiClient.processProjectPayment(id!);
      if (response.status === "success") {
        toast({
          title: "Payment Successful! 🎉",
          description: `Payment of ₹${response.paid_amount.toLocaleString()} processed successfully.`,
        });
        setShowPaymentDialog(false);
        fetchProject(); // Refresh project data
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const response = await apiClient.updateProject(id!, editData);
      if (response.status === "success") {
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
        setShowEditDialog(false);
        fetchProject();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "in_progress":
      case "ongoing":
        return "secondary";
      case "pending":
        return "outline";
      case "accepted":
        return "default";
      default:
        return "secondary";
    }
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <p className="text-muted-foreground">Project not found</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {project.title}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                {project.progress_percentage !== undefined && (
                  <Badge variant="outline">
                    {project.progress_percentage}% Complete
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {user.role === "admin" && (
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Project
                </Button>
              )}
              {project.project_amount && project.project_amount > 0 && (
                (() => {
                  const remaining = (project.project_amount || 0) - (project.paid_amount || 0);
                  if (remaining > 0) {
                    return (
                      <Button onClick={handlePayment} className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Pay Now (₹{remaining.toLocaleString()})
                      </Button>
                    );
                  }
                  return null;
                })()
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="phases">Phases</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.description}</p>
                  </CardContent>
                </Card>

                {/* Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Tech Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tech, index) => (
                          <Badge key={index} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Team Members */}
                {project.assigned_team && project.assigned_team.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Assigned Team
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {project.assigned_team.map((memberId, index) => (
                          <Badge key={index} variant="outline">
                            Member {index + 1}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Demo Link */}
                {project.status === "completed" && project.demo_link && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ExternalLink className="h-5 w-5" />
                        Demo Link
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        onClick={() => window.open(project.demo_link, "_blank")}
                        className="w-full"
                      >
                        View Demo
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Service Type
                      </Label>
                      <p className="text-foreground capitalize">
                        {project.service_type?.replace("_", " ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created At
                      </Label>
                      <p className="text-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Project Amount
                      </Label>
                      <p className="text-foreground font-semibold">
                        ₹{project.project_amount?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Paid Amount
                      </Label>
                      <p className="text-foreground font-semibold text-green-500">
                        ₹{project.paid_amount?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Remaining
                      </Label>
                      <p className="text-foreground font-semibold text-orange-500">
                        ₹{((project.project_amount || 0) - (project.paid_amount || 0)).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Payment Status
                      </Label>
                      <Badge
                        variant={
                          project.payment_status === "paid" ? "default" : "outline"
                        }
                      >
                        {project.payment_status || "unpaid"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress */}
                {project.progress_percentage !== undefined && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={project.progress_percentage} className="mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        {project.progress_percentage}% Complete
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="phases">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Phases</CardTitle>
                  {user.role === "admin" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditData({
                          ...editData,
                          phases: project.phases || []
                        });
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Phases
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {project.phases && project.phases.length > 0 ? (
                  <div className="space-y-4">
                    {project.phases.map((phase, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{phase.name}</p>
                            {phase.completed_on ? (
                              <p className="text-sm text-muted-foreground">
                                Completed:{" "}
                                {new Date(phase.completed_on).toLocaleDateString()}
                              </p>
                            ) : phase.status === "pending" ? (
                              <p className="text-sm text-muted-foreground">
                                Status: Pending
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Status: {phase.status}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant={getPhaseStatusColor(phase.status)}>
                          {phase.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No phases defined</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
                <CardDescription>
                  Communicate with the project team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] mb-4">
                  <div className="space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.sender_id === user.id
                              ? "bg-primary/10 ml-auto max-w-[80%]"
                              : "bg-secondary/50 max-w-[80%]"
                          }`}
                        >
                          <p className="text-sm text-foreground">{message.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No messages yet. Start a conversation!
                      </p>
                    )}
                  </div>
                </ScrollArea>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !newMessage.trim()}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendingMessage ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Dialog */}
        {project && (
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Process Payment</DialogTitle>
                <DialogDescription>
                  Complete payment for {project.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project Amount:</span>
                    <span className="font-semibold">₹{project.project_amount?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Already Paid:</span>
                    <span className="font-semibold text-green-500">₹{project.paid_amount?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground font-semibold">Amount to Pay:</span>
                    <span className="font-bold text-lg text-primary">
                      ₹{((project.project_amount || 0) - (project.paid_amount || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💳 This is a dummy payment. Click "Pay" to complete the transaction.
                  </p>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowPaymentDialog(false)}
                    disabled={processingPayment}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={processPayment}
                    disabled={processingPayment}
                    className="gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    {processingPayment ? "Processing..." : "Pay"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Admin Edit Dialog */}
        {user.role === "admin" && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>Update project details and status</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editData.status}
                    onValueChange={(value) => setEditData({ ...editData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Progress Percentage</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editData.progress_percentage}
                    onChange={(e) =>
                      setEditData({ ...editData, progress_percentage: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Tech Stack (comma-separated)</Label>
                  <Input
                    value={editData.tech_stack.join(", ")}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        tech_stack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <Label>Demo Link</Label>
                  <Input
                    type="url"
                    value={editData.demo_link}
                    onChange={(e) => setEditData({ ...editData, demo_link: e.target.value })}
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div>
                  <Label>Payment Link</Label>
                  <Input
                    type="url"
                    value={editData.payment_link}
                    onChange={(e) => setEditData({ ...editData, payment_link: e.target.value })}
                    placeholder="https://payment.example.com"
                  />
                </div>
                <div>
                  <Label>Project Amount (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editData.project_amount || project?.project_amount || 0}
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value) || 0;
                      setEditData({ ...editData, project_amount: amount });
                    }}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label>Payment Status</Label>
                  <Select
                    value={editData.payment_status}
                    onValueChange={(value) => setEditData({ ...editData, payment_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phases Editor */}
                <div className="border-t pt-4 mt-4">
                  <Label className="text-base font-semibold mb-4 block">Project Phases</Label>
                  <div className="space-y-3">
                    {editData.phases.map((phase: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">{phase.name}</Label>
                          <Select
                            value={phase.status || "pending"}
                            onValueChange={(value) => {
                              const updatedPhases = [...editData.phases];
                              updatedPhases[index] = {
                                ...updatedPhases[index],
                                status: value,
                                completed_on: value === "completed" 
                                  ? (phase.completed_on || new Date().toISOString().split('T')[0])
                                  : null
                              };
                              setEditData({ ...editData, phases: updatedPhases });
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {phase.status === "completed" && (
                          <div>
                            <Label className="text-sm">Completion Date</Label>
                            <Input
                              type="date"
                              value={phase.completed_on ? new Date(phase.completed_on).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                              onChange={(e) => {
                                const updatedPhases = [...editData.phases];
                                updatedPhases[index] = {
                                  ...updatedPhases[index],
                                  completed_on: e.target.value
                                };
                                setEditData({ ...editData, phases: updatedPhases });
                              }}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateProject}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;

