import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          throw new Error('Not authenticated');
        }

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching notifications:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in notifications query:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000,
    meta: {
      errorMessage: 'خطأ في تحميل الإشعارات'
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    },
    onError: () => {
      toast.error('خطأ في تحديث الإشعار');
    }
  });

  return {
    notifications,
    isError,
    markAsReadMutation
  };
}