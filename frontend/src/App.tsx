import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { apiClient, User } from "@/lib/api";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import FutureProjects from "./pages/FutureProjects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await apiClient.getCurrentUser();
      console.log("PANKAJ CURRENT USER ==> ",currentUser)
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await apiClient.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" replace /> : <Index user={user} onLogout={handleLogout} />} 
            />
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/dashboard" replace /> : <Auth setUser={setUser} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/future-projects" 
              element={<FutureProjects />} 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
