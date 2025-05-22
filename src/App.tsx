import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Analyst Pages
import AnalystOverviewPage from "./pages/analyst/AnalystOverviewPage";
import AssignedClientsPage from "./pages/analyst/AssignedClientsPage";
import MentionsLogPage from "./pages/analyst/MentionsLogPage";
import AnalystClientDetailPage from "./pages/analyst/AnalystClientDetailPage";
import SentNotificationsLogPage from "./pages/analyst/SentNotificationsLogPage"; // Import the new page


const queryClient = new QueryClient();

const isAuthenticated = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn;
};

const mockLogin = (role: 'admin' | 'analyst') => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", role);
};
const mockLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
};

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const role = localStorage.getItem("userRole");
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && role && !allowedRoles.includes(role)) {
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
            
            <Route 
              path="/admin/dashboard"
              element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
            >
              <Route path="overview" element={<AdminOverviewPage />} />
              <Route path="users" element={<ManageAnalystUsersPage />} />
              <Route path="clients" element={<ManageClientsPage />} />
              <Route path="assignments" element={<ClientAssignmentsPage />} />
              <Route index element={<Navigate to="overview" replace />} />
            </Route>

            <Route 
              path="/analyst/dashboard" 
              element={<ProtectedRoute allowedRoles={['analyst']}><AnalystDashboard /></ProtectedRoute>} 
            >
              <Route path="overview" element={<AnalystOverviewPage />} />
              <Route path="assigned-clients" element={<AssignedClientsPage />} />
              <Route path="mentions-log" element={<MentionsLogPage />} />
              <Route path="sent-notifications" element={<SentNotificationsLogPage />} /> {/* New route */}
              <Route path="client/:clientId/details" element={<AnalystClientDetailPage />} /> 
              <Route index element={<Navigate to="overview" replace />} />
            </Route>

            <Route 
              path="/" 
              element={
                isAuthenticated() ? (
                  localStorage.getItem("userRole") === "admin" ? <Navigate to="/admin/dashboard/overview" replace /> :
                  localStorage.getItem("userRole") === "analyst" ? <Navigate to="/analyst/dashboard/overview" replace /> :
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