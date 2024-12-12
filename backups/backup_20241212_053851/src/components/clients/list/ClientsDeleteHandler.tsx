import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useClientStore } from "@/data/clientsData";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useClientDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const removeClients = useClientStore(state => state.removeClients);
  const { t } = useTranslation();

  const deleteClients = async (selectedClients: string[]) => {
    if (!selectedClients.length || isDeleting) return;

    try {
      setIsDeleting(true);
      
      const maxRetries = 3;
      let retryCount = 0;
      let success = false;

      while (retryCount < maxRetries && !success) {
        try {
          const { error } = await supabase
            .from('clients')
            .delete()
            .in('id', selectedClients);

          if (error) throw error;
          success = true;
        } catch (err) {
          retryCount++;
          if (retryCount === maxRetries) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      removeClients(selectedClients);
      toast.success(t('clients.deleteSuccess'));
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (err) {
      console.error('Error in deleteClients:', err);
      toast.error(t('errors.deleteClients'));
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteClients, isDeleting };
};