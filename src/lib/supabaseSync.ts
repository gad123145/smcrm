import { supabase } from './supabaseClient';
import { LocalClientStorage } from './localClientStorage';
import { toast } from 'sonner';

export class SupabaseSync {
  private clientStorage: LocalClientStorage;
  private userId: string;

  constructor(userId: string) {
    this.clientStorage = new LocalClientStorage();
    this.userId = userId;
  }

  async syncToCloud() {
    try {
      // Get all local data
      const localClients = await this.clientStorage.getClients(this.userId);
      
      // Upload each client to Supabase
      for (const client of localClients) {
        const { error } = await supabase
          .from('clients')
          .upsert({
            ...client,
            last_synced: new Date().toISOString(),
            user_id: this.userId
          });

        if (error) throw error;
      }

      // Get and store last sync time
      localStorage.setItem('last_sync_time', new Date().toISOString());
      
      return { success: true, message: 'Sync completed successfully' };
    } catch (error: any) {
      console.error('Sync error:', error);
      return { success: false, message: error.message };
    }
  }

  async syncFromCloud() {
    try {
      const lastSyncTime = localStorage.getItem('last_sync_time');
      
      // Fetch updates from Supabase
      const { data: cloudClients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', this.userId)
        .gt('last_modified', lastSyncTime || '1970-01-01');

      if (error) throw error;

      // Update local storage with cloud data
      if (cloudClients) {
        for (const client of cloudClients) {
          await this.clientStorage.updateClient(client.id, client, this.userId);
        }
      }

      // Update last sync time
      localStorage.setItem('last_sync_time', new Date().toISOString());
      
      return { success: true, message: 'Cloud sync completed successfully' };
    } catch (error: any) {
      console.error('Cloud sync error:', error);
      return { success: false, message: error.message };
    }
  }

  async setupAutoSync(intervalMinutes: number = 5) {
    // Set up periodic sync
    setInterval(async () => {
      const syncResult = await this.syncToCloud();
      if (!syncResult.success) {
        toast.error('Auto-sync failed: ' + syncResult.message);
      }
    }, intervalMinutes * 60 * 1000);

    // Set up real-time subscription for changes
    supabase
      .channel('clients_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients' },
        async (payload) => {
          if (payload.new.user_id === this.userId) {
            await this.syncFromCloud();
          }
        }
      )
      .subscribe();
  }

  // Method to handle initial sync when app starts
  async initialSync() {
    const toCloudResult = await this.syncToCloud();
    if (!toCloudResult.success) {
      toast.error('Initial upload sync failed: ' + toCloudResult.message);
      return false;
    }

    const fromCloudResult = await this.syncFromCloud();
    if (!fromCloudResult.success) {
      toast.error('Initial download sync failed: ' + fromCloudResult.message);
      return false;
    }

    return true;
  }

  // Method to sync favorites
  async syncFavorites() {
    try {
      // Get local favorites
      const localFavorites = JSON.parse(localStorage.getItem(`favorites_${this.userId}`) || '[]');

      // Upload to Supabase
      for (const clientId of localFavorites) {
        const { error } = await supabase
          .from('client_favorites')
          .upsert({
            client_id: clientId,
            user_id: this.userId
          });

        if (error && error.code !== '23505') { // Ignore unique constraint violations
          throw error;
        }
      }

      // Get from Supabase
      const { data: cloudFavorites, error } = await supabase
        .from('client_favorites')
        .select('client_id')
        .eq('user_id', this.userId);

      if (error) throw error;

      // Update local storage
      if (cloudFavorites) {
        const favoriteIds = cloudFavorites.map(f => f.client_id);
        localStorage.setItem(`favorites_${this.userId}`, JSON.stringify(favoriteIds));
      }

      return { success: true };
    } catch (error: any) {
      console.error('Favorites sync error:', error);
      return { success: false, message: error.message };
    }
  }
}
