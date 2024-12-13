import { useState } from 'react';
import { useClientStore } from "@/data/clientsData";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LocalClientStorage } from "@/lib/localClientStorage";

export const useClientDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const removeClients = useClientStore(state => state.removeClients);
  const { t } = useTranslation();
  const clientStorage = new LocalClientStorage();

  const deleteClients = async (selectedClients: string[]) => {
    if (!selectedClients.length || isDeleting) return;

    try {
      setIsDeleting(true);
      
      const userId = 'local-user';
      await Promise.all(selectedClients.map(clientId => 
        clientStorage.deleteClient(clientId, userId)
      ));

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