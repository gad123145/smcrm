import {
  LayoutDashboard,
  Users,
  Home,
  ClipboardList,
  Bell,
  Settings,
  UserPlus,
  Bot,
  Building2,
  MessageCircle,
  BookOpen
} from "lucide-react";
import { staticClientStatuses } from "./clientStatuses";
import { supabase } from "@/integrations/supabase/client";

const getRole = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
    
  return profile?.role;
};

export const getSidebarItems = async () => {
  const role = await getRole();
  const isAdminOrSupervisor = role === 'admin' || role === 'supervisor';

  const baseItems = [
    { icon: LayoutDashboard, label: "nav.dashboard", path: "/" },
    { icon: Bot, label: "nav.assistant", path: "/assistant" },
    { icon: MessageCircle, label: "nav.chat", path: "/chat" },
    { 
      icon: Users, 
      label: "nav.clients", 
      path: "/clients", 
      hasSubmenu: true, 
      submenu: [
        { icon: Users, label: "status.all", path: "/clients" },
        ...staticClientStatuses.map(status => ({
          icon: status.icon,
          label: `status.${status.key}`,
          path: `/clients/${status.key}`
        }))
      ]
    },
    { icon: Home, label: "nav.properties", path: "/properties" },
    { icon: ClipboardList, label: "nav.projects", path: "/projects" },
    { icon: Building2, label: "nav.companies", path: "/companies" },
    { icon: ClipboardList, label: "nav.tasks", path: "/tasks" },
    { icon: Bell, label: "nav.notifications", path: "/notifications" },
    { icon: BookOpen, label: "nav.guides", path: "/guides" }
  ];

  if (isAdminOrSupervisor) {
    baseItems.push(
      { icon: Users, label: "nav.users", path: "/users" },
      { icon: UserPlus, label: "nav.addUser", path: "/users/add" },
      { icon: Settings, label: "nav.settings", path: "/settings" }
    );
  }

  return baseItems;
};