import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { TimeRange, TopUser } from "@/types/userTypes";
import { cn } from "@/lib/utils";
import { useGeminiAI } from "@/hooks/useGeminiAI";
import { supabase } from "@/integrations/supabase/client";
import { TopUsersList } from "./users/TopUsersList";
import { TopUsersInsights } from "./users/TopUsersInsights";
import { Database } from "@/integrations/supabase/types";

type ClientAction = Database['public']['Tables']['client_actions']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export function TopUsers() {
  const { t, i18n } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const isRTL = i18n.language === 'ar';
  const { generateText } = useGeminiAI();

  // Subscribe to realtime updates for both profiles and client actions
  useRealtimeSubscription('profiles', ['profiles']);
  useRealtimeSubscription('client_actions', ['client_actions']);

  const { data: users = [] } = useQuery({
    queryKey: ["users", timeRange],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

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

      // Get actions for the time period
      const { data: actions, error: actionsError } = await supabase
        .from('client_actions')
        .select('created_by, created_at')
        .gte('created_at', startDate.toISOString());

      if (actionsError) {
        console.error('Error fetching actions:', actionsError);
        throw actionsError;
      }

      // Count actions for each user
      const actionCounts: Record<string, number> = {};
      actions.forEach(action => {
        if (action.created_by) {
          actionCounts[action.created_by] = (actionCounts[action.created_by] || 0) + 1;
        }
      });

      // Combine profile data with action counts and sort by action count
      return profiles
        .map(profile => ({
          user_id: profile.id,
          full_name: profile.full_name,
          avatar: profile.avatar,
          role: profile.role,
          action_count: actionCounts[profile.id] || 0
        }))
        .sort((a, b) => b.action_count - a.action_count); // Sort by action count in descending order
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: aiInsights } = useQuery({
    queryKey: ["topUsersInsights", timeRange, users],
    queryFn: async () => {
      if (users.length === 0) return null;

      const prompt = `
        تحليل المستخدمين:
        
        البيانات:
        ${users.map((user: TopUser, index: number) => 
          `${index + 1}. ${user.full_name || 'مستخدم'} (${user.role || 'غير محدد'}) - عدد الإجراءات: ${user.action_count}
          `
        ).join('\n')}
        
        المطلوب:
        1. تحليل نشاط المستخدمين
        2. تحديد نقاط القوة
        3. اقتراحات للتحسين
        4. توصيات للفريق
      `;

      const response = await generateText(prompt);
      return response;
    },
    enabled: users.length > 0,
    refetchInterval: 1000 * 60 * 5, // Refresh insights every 5 minutes
  });

  return (
    <Card>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0 pb-2",
        isRTL && "font-cairo"
      )}>
        <CardTitle className={cn(
          "text-lg font-medium",
          isRTL && "font-cairo"
        )}>
          {isRTL ? "المستخدمون" : "Users"}
        </CardTitle>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
        >
          <SelectTrigger className={cn(
            "w-[180px]",
            isRTL && "font-cairo text-right"
          )}>
            <SelectValue placeholder={t("dashboard.selectPeriod")} />
          </SelectTrigger>
          <SelectContent align={isRTL ? "end" : "start"}>
            <SelectItem 
              value="daily"
              className={cn(isRTL && "font-cairo text-right")}
            >
              {t("dashboard.daily")}
            </SelectItem>
            <SelectItem 
              value="weekly"
              className={cn(isRTL && "font-cairo text-right")}
            >
              {t("dashboard.weekly")}
            </SelectItem>
            <SelectItem 
              value="monthly"
              className={cn(isRTL && "font-cairo text-right")}
            >
              {t("dashboard.monthly")}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <TopUsersList users={users} isRTL={isRTL} />
        <TopUsersInsights insights={aiInsights} isRTL={isRTL} />
      </CardContent>
    </Card>
  );
}