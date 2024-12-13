import { create } from 'zustand';
import { generateId } from '@/lib/utils';

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
  createdAt: string;
  updatedAt: string;
  userId: string;
  assignedTo?: string;
  next_action_date?: string;
  next_action_type?: string;
  comments?: string[];
  favorite?: boolean;
}

interface ClientStore {
  clients: Client[];
  searchQuery: string;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  removeClients: (clientIds: string[]) => void;
  toggleFavorite: (clientId: string) => void;
  setClients: (clients: Client[]) => void;
  setSearchQuery: (query: string) => void;
  getFilteredClients: () => Client[];
}

const CLIENTS_STORAGE_KEY = 'clients';

const loadClientsFromStorage = (): Client[] => {
  try {
    const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    return storedClients ? JSON.parse(storedClients) : [];
  } catch (error) {
    console.error('Error loading clients from storage:', error);
    return [];
  }
};

const saveClientsToStorage = (clients: Client[]) => {
  try {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  } catch (error) {
    console.error('Error saving clients to storage:', error);
  }
};

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: loadClientsFromStorage(),
  searchQuery: '',

  addClient: (client) => {
    const now = new Date().toISOString();
    const newClient: Client = {
      ...client,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      userId: '',
      assignedTo: '',
      next_action_date: '',
      next_action_type: '',
      comments: [],
      favorite: false,
    };

    set((state) => {
      const updatedClients = [...state.clients, newClient];
      saveClientsToStorage(updatedClients);
      return { clients: updatedClients };
    });
  },

  updateClient: (id, updates) => {
    set((state) => {
      const updatedClients = state.clients.map((client) =>
        client.id === id
          ? { ...client, ...updates, updatedAt: new Date().toISOString() }
          : client
      );
      saveClientsToStorage(updatedClients);
      return { clients: updatedClients };
    });
  },

  removeClients: (clientIds) => {
    set((state) => {
      const updatedClients = state.clients.filter(
        (client) => !clientIds.includes(client.id)
      );
      saveClientsToStorage(updatedClients);
      return { clients: updatedClients };
    });
  },

  toggleFavorite: (clientId) => {
    set((state) => {
      const updatedClients = state.clients.map((client) =>
        client.id === clientId
          ? { ...client, favorite: !client.favorite }
          : client
      );
      saveClientsToStorage(updatedClients);
      return { clients: updatedClients };
    });
  },

  setClients: (clients) => {
    saveClientsToStorage(clients);
    set({ clients });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

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
}));
