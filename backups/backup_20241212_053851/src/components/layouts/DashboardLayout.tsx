import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocation } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsPopover } from "./NotificationsPopover";
import { InstantClientSearch } from "@/components/search/InstantClientSearch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type DashboardLayoutProps = {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export function DashboardLayout({ children, sidebarOpen, setSidebarOpen }: DashboardLayoutProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return 0;

        const { data, error } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('is_read', false);

        if (error) {
          console.error('Error fetching unread notifications:', error);
          toast.error('فشل في تحميل الإشعارات');
          return 0;
        }

        return data?.length || 0;
      } catch (error) {
        console.error('Error in unread notifications query:', error);
        toast.error('حدث خطأ أثناء تحميل الإشعارات');
        return 0;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000,
    meta: {
      errorMessage: 'فشل في تحميل الإشعارات'
    }
  });

  const handleSidebarToggle = () => {
    if (location.pathname.includes('/users')) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark font-cairo">
      <header className="fixed top-0 right-0 left-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-14">
        <div className="h-full px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleSidebarToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <h1 className={cn(
                "text-xl font-semibold dark:text-white transition-all duration-300",
                isRTL ? "font-cairo" : "font-sans",
                "hover:text-primary"
              )}>
                {t("dashboard.title")}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <InstantClientSearch />
            </div>
            <NotificationsPopover unreadCount={unreadCount} />
            <ThemeToggle />
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className={cn(
        "pt-14 min-h-[calc(100vh-3.5rem)] flex",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}>
        {children}
      </div>
    </div>
  );
}