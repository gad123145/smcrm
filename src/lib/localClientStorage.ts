import { generateId } from "./utils/id";

export interface Client {
  id: string;
  name: string;
  phone: string;
  country?: string;
  contact_method?: string;
  email?: string | null;
  facebook?: string | null;
  city?: string | null;
  project?: string | null;
  budget?: string | null;
  campaign?: string | null;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const LOCAL_STORAGE_KEYS = {
  CLIENTS: 'clients',
};

export class LocalClientStorage {
  private getClients(): Client[] {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.CLIENTS);
    return storedData ? JSON.parse(storedData) : [];
  }

  private saveClients(clients: Client[]) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }

  async checkDuplicates(data: any[]) {
    const phones = data.map(row => row.phone).filter(Boolean);
    console.log('Checking duplicates for phones:', phones);

    if (phones.length === 0) return [];

    const existingClients = this.getClients();
    const duplicates = existingClients.filter(client => 
      phones.includes(client.phone)
    );
    
    console.log('Found existing clients:', duplicates);
    return duplicates;
  }

  async importClients(data: any[], userId: string) {
    try {
      console.log('Starting import with data:', data);
      
      // Check for duplicates first
      const duplicates = await this.checkDuplicates(data);
      console.log('Found duplicates:', duplicates);

      // Filter out duplicates by phone number
      const newClients = data.filter(client => {
        if (!client.phone) return false;
        
        const isDuplicate = duplicates.some(existing => 
          existing.phone && client.phone && 
          existing.phone.toString() === client.phone.toString()
        );
        
        if (isDuplicate) {
          console.log('Skipping duplicate client:', client.name, 'with phone:', client.phone);
        }
        
        return !isDuplicate;
      });

      console.log('New clients to import:', newClients);

      if (newClients.length === 0) {
        return {
          imported: 0,
          duplicates: duplicates.length,
          duplicatePhones: duplicates.map(d => d.phone),
          total: data.length
        };
      }

      const mappedData = newClients.map((row) => ({
        id: generateId(),
        name: row.name || "",
        phone: row.phone || "",
        country: row.country || "Egypt",
        contact_method: row.contactMethod || "phone",
        email: row.email || null,
        facebook: row.facebook || null,
        city: row.city || null,
        project: row.project || null,
        budget: row.budget || null,
        campaign: row.campaign || null,
        status: "new",
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      console.log('Importing mapped data:', mappedData);

      if (mappedData.length > 0) {
        const existingClients = this.getClients();
        this.saveClients([...existingClients, ...mappedData]);
      }

      return {
        imported: newClients.length,
        duplicates: duplicates.length,
        duplicatePhones: duplicates.map(d => d.phone),
        total: data.length
      };
    } catch (error) {
      console.error("Error in importClients:", error);
      throw error;
    }
  }

  async getAllClients(): Promise<Client[]> {
    return this.getClients();
  }

  async getClientsByUserId(userId: string): Promise<Client[]> {
    const clients = this.getClients();
    return clients.filter(client => client.user_id === userId);
  }

  async addClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const clients = this.getClients();
    this.saveClients([...clients, newClient]);
    return newClient;
  }

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    const clients = this.getClients();
    const clientIndex = clients.findIndex(c => c.id === id);
    
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }

    const updatedClient = {
      ...clients[clientIndex],
      ...clientData,
      updated_at: new Date().toISOString(),
    };

    clients[clientIndex] = updatedClient;
    this.saveClients(clients);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<void> {
    const clients = this.getClients();
    const filteredClients = clients.filter(c => c.id !== id);
    this.saveClients(filteredClients);
  }
}
