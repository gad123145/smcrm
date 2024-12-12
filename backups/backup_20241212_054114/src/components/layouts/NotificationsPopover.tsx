import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ClientPreviewDialog } from "../clients/ClientPreviewDialog";
import { NotificationItem } from "../notifications/NotificationItem";
import { useNotifications } from "../notifications/useNotifications";

interface NotificationsPopoverProps {
  unreadCount: number;
}

export function NotificationsPopover({ unreadCount }: NotificationsPopoverProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, isError, markAsReadMutation } = useNotifications();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const audio = new Audio("/notification-sound.mp3");
    const checkReminders = () => {
      if (!notifications) return;
      
      notifications.forEach((notification) => {
        if (!notification.is_read && notification.type === 'task_reminder') {
          const notificationDate = new Date(notification.created_at);
          if (notificationDate <= new Date()) {
            audio.currentTime = 0;
            audio.play().catch((error) => console.error('Error playing sound:', error));
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    checkReminders();

    return () => {
      clearInterval(interval);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [notifications]);

  const handleNotificationClick = async (notification: any) => {
    try {
      if (!notification.is_read) {
        await markAsReadMutation.mutate(notification.id);
      }
      
      setOpen(false);

      if (notification.type === 'client_action') {
        const clientNameMatch = notification.message.match(isRTL ? /للعميل:\s*([^-]+)/ : /for client:\s*([^-]+)/);
        if (!clientNameMatch) {
          console.error('Could not extract client name from message:', notification.message);
          toast.error(t('notifications.clientNotFound'));
          return;
        }

        const clientName = clientNameMatch[1].trim();
        const { data: clients, error } = await supabase
          .from('clients')
          .select('*')
          .eq('name', clientName)
          .limit(1);

        if (error) {
          console.error('Error finding client:', error);
          toast.error(t('notifications.errorFindingClient'));
          return;
        }

        if (clients && clients.length > 0) {
          const client = clients[0];
          setSelectedClient(client);
          setIsPreviewOpen(true);
          navigate('/clients/new');
          toast.success(t('notifications.clientPageOpened'));
        } else {
          console.error('No client found with name:', clientName);
          toast.error(t('notifications.clientNotFound'));
        }
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error(t('notifications.errorHandlingNotification'));
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full px-1 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold ${isRTL ? 'font-cairo' : ''}`}>
              {t("notifications.title")}
            </h3>
          </div>
          <ScrollArea className="h-[400px]">
            {isError ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t("notifications.errorLoading")}
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t("notifications.empty")}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {selectedClient && (
        <ClientPreviewDialog
          client={selectedClient}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      )}
    </>
  );
}