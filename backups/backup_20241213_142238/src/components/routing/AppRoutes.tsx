import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import { AuthenticatedRoutes } from "./routes/AuthenticatedRoutes";
import { AIAssistant } from "@/components/AIAssistant";
import { ProtectedRoute } from "./ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/assistant" element={
        <ProtectedRoute>
          <SidebarProvider>
            <DashboardLayout sidebarOpen={true} setSidebarOpen={() => {}}>
              <DashboardSidebar open={true} />
              <DashboardContent>
                <div className="max-w-4xl mx-auto">
                  <AIAssistant />
                </div>
              </DashboardContent>
            </DashboardLayout>
          </SidebarProvider>
        </ProtectedRoute>
      } />
      <Route path="/*" element={<AuthenticatedRoutes />} />
    </Routes>
  );
}