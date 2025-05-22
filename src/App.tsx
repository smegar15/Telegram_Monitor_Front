import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index"; // Will be phased out or repurposed
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";

const queryClient = new QueryClient();

// Placeholder for auth state - in a real app, this would come from context/store
const isAuthenticated = () => {
  // For now, let's assume if you're not on login, you're "authenticated"
  // This is a very basic check and will be replaced by actual auth logic
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Example, not secure
  console.log("Current auth status (mock):", isLoggedIn);
  return isLoggedIn;
};

// Mock login/logout for simulation - REMOVE in real auth
const mockLogin = (role: 'admin' | 'analyst') => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", role); // Example
};
const mockLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
};

// ProtectedRoute component (basic example)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const role = localStorage.getItem("userRole"); // Example
  console.log("ProtectedRoute check. Role:", role, "Allowed:", allowedRoles);
  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    console.log("Role not allowed, redirecting to /unauthorized or /login");
    // You might want a specific /unauthorized page
    return <Navigate to="/login" replace />; // Or a generic dashboard / error page
  }
  return children;
};


const App = () => {
  // Example: Clear mock auth on app load if you want to always start at login
  // React.useEffect(() => {
  //  mockLogout();
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analyst/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['analyst']}>
                  <AnalystDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Default route: if authenticated, go to role-based dashboard, else to login */}
            <Route 
              path="/" 
              element={
                isAuthenticated() ? (
                  localStorage.getItem("userRole") === "admin" ? <Navigate to="/admin/dashboard" replace /> :
                  localStorage.getItem("userRole") === "analyst" ? <Navigate to="/analyst/dashboard" replace /> :
                  <Navigate to="/login" replace /> // Fallback if role is unknown
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* Fallback for old Index page, can be removed or repurposed */}
            <Route path="/index-fallback" element={<Index />} /> 
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Export mock functions for LoginPage to use (TEMPORARY)
export { mockLogin, mockLogout }; 
export default App;