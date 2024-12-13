import { create } from 'zustand'
import { Client } from '@/types/client'

interface ClientStore {
  clients: Client[]
  setClients: (clients: Client[]) => void
  addClient: (client: Client) => void
  updateClient: (updatedClient: Client) => void
  deleteClient: (clientId: string) => void
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  
  setClients: (clients) => set({ clients }),
  
  addClient: (client) =>
    set((state) => ({
      clients: [client, ...state.clients],
    })),
    
  updateClient: (updatedClient) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      ),
    })),
    
  deleteClient: (clientId) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== clientId),
    })),
}))
