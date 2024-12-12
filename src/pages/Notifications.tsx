import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isRTL = i18n.language === 'ar';

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    },
  });

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <main className={cn(
        "flex-1 p-6 transition-all duration-300",
        sidebarOpen ? (isRTL ? "mr-64" : "ml-64") : "m-0"
      )}>
        <div className="mb-6">
          <h1 className={cn(
            "text-2xl font-semibold",
            isRTL && "font-cairo"
          )}>
            {t("nav.notifications")}
          </h1>
        </div>
        <Card className="p-0">
          <ScrollArea className="h-[600px]">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      !notification.is_read ? "bg-blue-50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <div className={cn(
                      "flex justify-between items-start gap-2",
                      isRTL && "flex-row-reverse"
                    )}>
                      <div className={cn(
                        "space-y-1",
                        isRTL && "text-right font-cairo"
                      )}>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {format(new Date(notification.created_at), "PPp")}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          className={cn(
                            "text-xs",
                            isRTL && "font-cairo"
                          )}
                        >
                          {t("notifications.markAsRead")}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={cn(
                "p-4 text-center text-gray-500 dark:text-gray-400",
                isRTL && "font-cairo"
              )}>
                {t("notifications.empty")}
              </div>
            )}
          </ScrollArea>
        </Card>
      </main>
    </DashboardLayout>
  );
};

export default Notifications;