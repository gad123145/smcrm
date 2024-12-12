import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { cn } from "@/lib/utils";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { User } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";

export default function Users() {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isRTL = i18n.language === 'ar';

  // Enable real-time subscription for profiles table
  useRealtimeSubscription('profiles', ['users']);

  // Get current user's role
  const { data: currentUserRole } = useQuery({
    queryKey: ["currentUserRole"],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          toast.error(isRTL ? "غير مصرح به" : "Unauthorized");
          return null;
        }

        const { data: profiles } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id);

        // Return the role from the first profile found, or null if no profile exists
        return profiles && profiles.length > 0 ? profiles[0].role : null;
      } catch (error: any) {
        console.error("Error fetching user role:", error);
        toast.error(isRTL ? "خطأ في جلب صلاحيات المستخدم" : "Error fetching user role");
        return null;
      }
    },
    retry: 1
  });

  // Fetch all users using the edge function
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No session');
        }

        const { data, error } = await supabase.functions.invoke('list-users', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) throw error;
        return data as User[];
      } catch (error: any) {
        console.error("Error fetching users:", error);
        throw new Error(isRTL ? "خطأ في تحميل المستخدمين" : "Error loading users");
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  if (error) {
    toast.error(isRTL ? "خطأ في تحميل المستخدمين" : "Error loading users");
  }

  const isAdmin = currentUserRole === 'admin';

  const getRoleLabel = (role: string | null) => {
    if (!role) return '';
    switch (role) {
      case 'admin':
        return isRTL ? 'مدير النظام' : 'Administrator';
      case 'supervisor':
        return isRTL ? 'مشرف' : 'Supervisor';
      case 'sales':
        return isRTL ? 'مبيعات' : 'Sales';
      case 'employee':
        return isRTL ? 'موظف' : 'Employee';
      default:
        return role;
    }
  };

  const getStatusLabel = (status: string | null) => {
    if (!status) return '';
    return status === 'active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive');
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <div className={cn(
        "flex-1 p-8 transition-all duration-300",
        sidebarOpen ? (isRTL ? "mr-64" : "ml-64") : "m-0"
      )}>
        <UsersHeader isAdmin={isAdmin} isRTL={isRTL} />
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <UsersTable 
            users={users}
            isLoading={isLoading}
            isAdmin={isAdmin}
            isRTL={isRTL}
            getRoleLabel={getRoleLabel}
            getStatusLabel={getStatusLabel}
            refetch={refetch}
          />
        )}
      </div>
    </DashboardLayout>
  );
}