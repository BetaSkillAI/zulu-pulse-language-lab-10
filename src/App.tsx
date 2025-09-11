import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProgressProvider } from "./contexts/UserProgressContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import LessonDetail from "./pages/LessonDetail";
import Music from "./pages/Music";
import Practice from "./pages/Practice";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UserProgressProvider>
            <div className="min-h-screen">
              <Navigation />
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/courses" 
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lesson/:id" 
                element={
                  <ProtectedRoute>
                    <LessonDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/music" 
                element={
                  <ProtectedRoute>
                    <Music />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/practice" 
                element={
                  <ProtectedRoute>
                    <Practice />
                  </ProtectedRoute>
                } 
              />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          </UserProgressProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
