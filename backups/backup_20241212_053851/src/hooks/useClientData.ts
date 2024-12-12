import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useClientStore } from "@/data/clientsData";
import { toast } from "sonner";

export const useClientData = (status: string, userRole: string | null) => {
  const [error, setError] = useState<string | null>(null);
  const getFilteredClients = useClientStore(state => state.getFilteredClients);

  const clients = getFilteredClients().filter(client => {
    if (status === "all") {
      if (userRole === 'admin' || userRole === 'supervisor') {
        return true;
      }
      return client.assignedTo;
    }
    
    const statusMatch = client.status === status;
    if (userRole === 'admin' || userRole === 'supervisor') {
      return statusMatch;
    }
    return statusMatch && client.assignedTo;
  });

  return { clients, error };
};