import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "@/pages/Index";
import Clients from "@/pages/Clients";
import Projects from "@/pages/Projects";
import Properties from "@/pages/Properties";
import Companies from "@/pages/Companies";
import CompanyDetails from "@/pages/CompanyDetails";
import ProjectDetails from "@/pages/ProjectDetails";
import EditProject from "@/pages/EditProject";
import Tasks from "@/pages/Tasks";
import Users from "@/pages/Users";
import AddUser from "@/pages/AddUser";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import Chat from "@/pages/Chat";
import Analytics from "@/pages/Analytics";
import Guides from "@/pages/Guides";
import SalesGuide from "@/pages/guides/SalesGuide";
import ClientManagement from "@/pages/guides/ClientManagement";
import ProjectManagement from "@/pages/guides/ProjectManagement";
import CompanyProjects from "@/pages/CompanyProjects";
import EditCompany from "@/pages/EditCompany";

export function AuthenticatedRoutes() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
        <Route path="/clients/:status" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
        <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetails /></ProtectedRoute>} />
        <Route path="/companies/:id/edit" element={<ProtectedRoute><EditCompany /></ProtectedRoute>} />
        <Route path="/companies/:id/projects" element={<ProtectedRoute><CompanyProjects /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/users/add" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/guides" element={<ProtectedRoute><Guides /></ProtectedRoute>} />
        <Route path="/guides/sales" element={<ProtectedRoute><SalesGuide /></ProtectedRoute>} />
        <Route path="/guides/client-management" element={<ProtectedRoute><ClientManagement /></ProtectedRoute>} />
        <Route path="/guides/project-management" element={<ProtectedRoute><ProjectManagement /></ProtectedRoute>} />
      </Routes>
    </SidebarProvider>
  );
}