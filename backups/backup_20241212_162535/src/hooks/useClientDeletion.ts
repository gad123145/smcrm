import { useCallback } from 'react';
import { useClientStore } from '@/data/clientsData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { Client, ClientStatus } from '@/data/clientsData';

export function useClientDeletion() {
  const { t } = useTranslation();
  const removeClients = useClientStore(state => state.removeClients);

  const deleteClients = useCallback(async (clientIds: string[]) => {
    if (!clientIds.length) {
      console.log('No clients selected for deletion');
      return false;
    }

    try {
      console.log('Attempting to delete clients:', clientIds);
      
      // First update local state to provide immediate feedback
      removeClients(clientIds);
      
      // Then delete from Supabase
      const { error } = await supabase
        .from('clients')
        .delete()
        .in('id', clientIds);

      if (error) {
        console.error('Supabase deletion error:', error);
        throw error;
      }

      console.log('Successfully deleted from Supabase');
      toast.success(t('clients.deleteSuccess'));
      
      return true;
    } catch (err) {
      console.error('Error in useClientDeletion:', err);
      toast.error(t('errors.deleteClients'));
      // Revert local state on error by fetching fresh data
      const { data } = await supabase.from('clients').select('*');
      if (data) {
        // Transform the data to match Client type
        const transformedData = data.map(client => ({
          ...client,
          id: client.id,
          salesPerson: client.sales_person,
          contactMethod: client.contact_method,
          status: client.status as ClientStatus,
          createdAt: new Date(client.created_at),
          updatedAt: new Date(client.updated_at),
          userId: client.user_id,
          assignedTo: client.assigned_to,
          next_action_date: client.next_action_date ? new Date(client.next_action_date) : undefined,
          next_action_type: client.next_action_type,
          comments: client.comments || []
        }));
        useClientStore.getState().setClients(transformedData);
      }
      return false;
    }
  }, [removeClients, t]);

  return { deleteClients };
}