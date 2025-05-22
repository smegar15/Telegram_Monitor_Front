import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index"; 
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";

// Admin Pages
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import ManageAnalystUsersPage from "./pages/admin/ManageAnalystUsersPage";
import ManageClientsPage from "./pages/admin/ManageClientsPage";
import ClientAssignmentsPage from "./pages/admin/ClientAssignmentsPage";

const queryClient = new QueryClient();

const isAuthenticated = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  console.log("Current auth status (mock):", isLoggedIn);
  return isLoggedIn;
};

const mockLogin = (role: 'admin' | 'analyst') => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", role);
  console.log(`Mock login as ${role}`);
};
const mockLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  console.log("Mock logout");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const role = localStorage.getItem("userRole");
  console.log("ProtectedRoute check. Role:", role, "Allowed:", allowedRoles);
  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    console.log("Role not allowed, redirecting to /login (or an unauthorized page)");
    return <Navigate to="/login" replace />; 
  }
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="overview" element={<AdminOverviewPage />} />
              <Route path="users" element={<ManageAnalystUsersPage />} />
              <Route path="clients" element={<ManageClientsPage />} />
              <Route path="assignments" element={<ClientAssignmentsPage />} />
              {/* Default admin view to overview */}
              <Route index element={<Navigate to="overview" replace />} />
            </Route>

            {/* Analyst Routes */}
            <Route 
              path="/analyst/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['analyst']}>
                  <AnalystDashboard />
                </ProtectedRoute>
              } 
            >
              {/* TODO: Add Analyst nested routes here, e.g., assigned clients, keyword management */}
               <Route index element={<div>Analyst Overview Placeholder</div>} /> {/* Placeholder */}
            </Route>

            {/* Default route */}
            <Route 
              path="/" 
              element={
                isAuthenticated() ? (
                  localStorage.getItem("userRole") === "admin" ? <Navigate to="/admin/dashboard/overview" replace /> :
                  localStorage.getItem("userRole") === "analyst" ? <Navigate to="/analyst/dashboard" replace /> :
                  <Navigate to="/login" replace /> 
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route path="/index-fallback" element={<Index />} /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export { mockLogin, mockLogout }; 
export default App;