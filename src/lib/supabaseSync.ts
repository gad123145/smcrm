import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/types';

export class SupabaseSync {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private async getLocalClients(): Promise<Client[]> {
    try {
      const clientsJson = localStorage.getItem('clients');
      return clientsJson ? JSON.parse(clientsJson) : [];
    } catch (error) {
      console.error('Error getting local clients:', error);
      return [];
    }
  }

  private async saveLocalClients(clients: Client[]) {
    try {
      localStorage.setItem('clients', JSON.stringify(clients));
    } catch (error) {
      console.error('Error saving local clients:', error);
      throw error;
    }
  }

  async syncToCloud() {
    try {
      console.log('Starting syncToCloud...');
      const localClients = await this.getLocalClients();
      
      if (!localClients.length) {
        console.log('No local clients to sync');
        return { success: true };
      }

      const { error } = await supabase
        .from('clients')
        .upsert(
          localClients.map(client => ({
            ...client,
            user_id: this.userId,
            last_synced: new Date().toISOString()
          }))
        );

      if (error) {
        console.error('Error syncing to cloud:', error);
        throw error;
      }

      console.log('Successfully synced to cloud');
      return { success: true };
    } catch (error: any) {
      console.error('Error in syncToCloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncFromCloud() {
    try {
      console.log('Starting syncFromCloud...');
      const { data: cloudClients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching from cloud:', error);
        throw error;
      }

      if (!cloudClients) {
        console.log('No cloud clients found');
        return { success: true };
      }

      await this.saveLocalClients(cloudClients);
      console.log('Successfully synced from cloud');
      return { success: true };
    } catch (error: any) {
      console.error('Error in syncFromCloud:', error);
      return { success: false, message: error.message };
    }
  }

  async initialSync() {
    try {
      console.log('Starting initial sync...');
      const toCloudResult = await this.syncToCloud();
      if (!toCloudResult.success) {
        throw new Error(toCloudResult.message);
      }

      const fromCloudResult = await this.syncFromCloud();
      if (!fromCloudResult.success) {
        throw new Error(fromCloudResult.message);
      }

      console.log('Initial sync completed successfully');
      return true;
    } catch (error) {
      console.error('Error in initial sync:', error);
      return false;
    }
  }
}
