import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";

export type ClientStatus = 'new' | 'potential' | 'interested' | 'responded' | 'noResponse' | 
  'scheduled' | 'postMeeting' | 'booked' | 'cancelled' | 'sold' | 'postponed' | 'resale';

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  phone: string;
  country: string;
  email?: string;
  city?: string;
  project?: string;
  budget?: string;
  salesPerson?: string;
  contactMethod: string;
  facebook?: string;
  campaign?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  assignedTo?: string;
  next_action_date?: Date;
  next_action_type?: string;
  comments?: string[];
}

interface ClientStore {
  clients: Client[];
  searchQuery: string;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  removeClients: (clientIds: string[]) => void;
  setClients: (clients: Client[]) => void;
  setSearchQuery: (query: string) => void;
  getFilteredClients: () => Client[];
}

export const useClientStore = create<ClientStore>((set, get) => {
  const channel = supabase.channel('clients_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'clients'
      },
      async (payload) => {
        const { data: clients } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (clients) {
          set({ 
            clients: clients.map(client => ({
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
            })) 
          });
        }
      }
    )
    .subscribe();

  return {
    clients: [],
    searchQuery: '',
    setClients: (clients) => set({ clients }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    getFilteredClients: () => {
      const { clients, searchQuery } = get();
      if (!searchQuery || !searchQuery.trim()) return clients;

      const query = searchQuery.toLowerCase().trim();
      return clients.filter(client => {
        const searchableFields = [
          client.name,
          client.phone,
          client.facebook,
          client.email,
          client.city,
          client.project,
          client.salesPerson,
          client.country,
          client.budget,
          client.campaign,
          client.contactMethod,
          ...(client.comments || [])
        ].filter(Boolean);

        return searchableFields.some(field => 
          String(field).toLowerCase().includes(query)
        );
      });
    },

    addClient: async (clientData) => {
      const user = supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const { data: userData } = await user;
      
      const newClient = {
        name: clientData.name,
        status: clientData.status,
        phone: clientData.phone,
        country: clientData.country,
        email: clientData.email,
        city: clientData.city,
        project: clientData.project,
        budget: clientData.budget,
        sales_person: clientData.salesPerson,
        contact_method: clientData.contactMethod,
        facebook: clientData.facebook,
        campaign: clientData.campaign,
        user_id: userData.user.id,
        next_action_date: clientData.next_action_date?.toISOString(),
        next_action_type: clientData.next_action_type
      };

      const { error } = await supabase
        .from('clients')
        .insert([newClient]);

      if (error) {
        console.error('Error adding client:', error);
        return;
      }
    },

    removeClients: async (clientIds) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .in('id', clientIds);

      if (error) {
        console.error('Error removing clients:', error);
        return;
      }

      set(state => ({
        clients: state.clients.filter(client => !clientIds.includes(client.id))
      }));
    },
  };
});

// Initialize clients from Supabase
supabase
  .from('clients')
  .select('*')
  .order('created_at', { ascending: false })
  .then(({ data: clients, error }) => {
    if (error) {
      console.error('Error fetching clients:', error);
      return;
    }
    if (clients) {
      useClientStore.getState().setClients(
        clients.map(client => ({
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
        }))
      );
    }
  });

