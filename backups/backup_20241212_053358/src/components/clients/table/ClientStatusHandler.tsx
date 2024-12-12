import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ClientStatusSelect } from "../status/ClientStatusSelect";

interface ClientStatusHandlerProps {
  clientId: string;
  status: string;
  userId: string;
  assignedTo?: string | null;
  clientName: string;
}

export function ClientStatusHandler({ 
  clientId, 
  status, 
  userId,
  assignedTo,
  clientName 
}: ClientStatusHandlerProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from('clients')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (updateError) throw updateError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update WhatsApp stats if status changed to whatsappContact
      if (newStatus === 'whatsappContact') {
        const { data: existingStats, error: statsError } = await supabase
          .from('whatsapp_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (statsError && statsError.code !== 'PGRST116') {
          throw statsError;
        }

        if (existingStats) {
          const { error: updateStatsError } = await supabase
            .from('whatsapp_stats')
            .update({ sent_count: (existingStats.sent_count || 0) + 1 })
            .eq('user_id', user.id);

          if (updateStatsError) throw updateStatsError;
        } else {
          const { error: insertStatsError } = await supabase
            .from('whatsapp_stats')
            .insert([{ user_id: user.id, sent_count: 1, received_count: 0 }]);

          if (insertStatsError) throw insertStatsError;
        }
      }

      // Update Messenger stats if status changed to facebookContact
      if (newStatus === 'facebookContact') {
        const { data: existingStats, error: statsError } = await supabase
          .from('messenger_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (statsError && statsError.code !== 'PGRST116') {
          throw statsError;
        }

        if (existingStats) {
          const { error: updateStatsError } = await supabase
            .from('messenger_stats')
            .update({ sent_count: (existingStats.sent_count || 0) + 1 })
            .eq('user_id', user.id);

          if (updateStatsError) throw updateStatsError;
        } else {
          const { error: insertStatsError } = await supabase
            .from('messenger_stats')
            .insert([{ user_id: user.id, sent_count: 1, received_count: 0 }]);

          if (insertStatsError) throw insertStatsError;
        }
      }

      const { error: actionError } = await supabase
        .from('client_actions')
        .insert({
          client_id: clientId,
          action_type: newStatus,
          comment: `${t('clients.notifications.clientStatusUpdated')} ${t(`clients.status.${newStatus}`)}`,
          created_by: user.id
        });

      if (actionError) throw actionError;

      const notificationUserId = assignedTo || userId;
      if (notificationUserId && notificationUserId !== user.id) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: notificationUserId,
            title: t('clients.notifications.statusUpdate'),
            message: `${t('clients.notifications.clientStatusUpdated')} ${clientName} ${t('clients.notifications.to')} ${t(`clients.status.${newStatus}`)}`,
            type: 'status_update'
          });

        if (notificationError) throw notificationError;
      }

      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp_stats'] });
      queryClient.invalidateQueries({ queryKey: ['messenger_stats'] });
      
      toast.success(t('clients.statusUpdateSuccess'));
    } catch (error: any) {
      console.error('Error updating client status:', error);
      toast.error(t('errors.unexpected'));
    }
  };

  return (
    <ClientStatusSelect 
      status={status}
      onStatusChange={handleStatusChange}
    />
  );
}