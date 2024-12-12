import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TimeRange = "daily" | "weekly" | "monthly";

export type TopUser = {
  user_id: string;
  full_name: string | null;
  role: string | null;
  avatar: string | null;
  action_count: number;
};

export async function updateUserAsAdmin(userId: string) {
  try {
    // تحديث البيانات الوصفية للمستخدم
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        app_metadata: {
          role: "admin"
        },
        user_metadata: {
          role: "admin",
          permissions: [
            "users.create",
            "users.edit",
            "users.delete",
            "users.assign",
            "clients.create",
            "clients.edit",
            "clients.delete",
            "clients.import",
            "clients.export",
            "clients.assign",
            "projects.create",
            "projects.edit",
            "projects.delete",
            "tasks.create",
            "tasks.edit",
            "tasks.delete",
            "companies.create",
            "companies.edit",
            "companies.delete",
            "companies.view",
            "ai.unlimited"
          ]
        }
      }
    );

    if (updateError) {
      throw updateError;
    }

    // تحديث الملف الشخصي في جدول profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin',
      })
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }

    toast.success("تم تحديث صلاحيات المستخدم بنجاح");
    return true;
  } catch (error: any) {
    console.error('Error updating user:', error);
    toast.error(error.message);
    return false;
  }
}

export async function fetchTopUsers(timeRange: TimeRange): Promise<TopUser[]> {
  try {
    let startDate = new Date();
    
    switch (timeRange) {
      case "daily":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "weekly":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    // First get the actions and count them by user
    const { data: actions, error: actionsError } = await supabase
      .from('client_actions')
      .select('created_by')
      .gte('created_at', startDate.toISOString())
      .not('created_by', 'is', null);

    if (actionsError) throw actionsError;

    // Count actions by user
    const userActionCounts = actions.reduce((acc: Record<string, number>, curr) => {
      const userId = curr.created_by;
      acc[userId] = (acc[userId] || 0) + 1;
      return acc;
    }, {});

    // Get user profiles for users with actions
    const userIds = Object.keys(userActionCounts);
    if (userIds.length === 0) return [];

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, role, avatar')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // Combine action counts with user profiles
    const topUsers = profiles.map(profile => ({
      user_id: profile.id,
      full_name: profile.full_name,
      role: profile.role,
      avatar: profile.avatar,
      action_count: userActionCounts[profile.id] || 0
    }));

    // Sort by action count and return top 5
    return topUsers
      .sort((a, b) => b.action_count - a.action_count)
      .slice(0, 5);

  } catch (error: any) {
    console.error('Error fetching top users:', error);
    toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
    return [];
  }
}