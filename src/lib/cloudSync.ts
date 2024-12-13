import { LocalClientStorage } from './localClientStorage';

export class CloudSync {
  private clientStorage: LocalClientStorage;
  private userId: string;
  private syncEndpoint: string;

  constructor(userId: string) {
    this.clientStorage = new LocalClientStorage();
    this.userId = userId;
    this.syncEndpoint = '/.netlify/functions/sync-data';
  }

  private async fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        if (response.status === 404) throw new Error('Sync endpoint not found');
        if (response.status === 401) throw new Error('Unauthorized');
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Failed after retries');
  }

  async syncToCloud() {
    try {
      // Get all local data
      const localClients = await this.clientStorage.getClients(this.userId);
      
      // Send to cloud
      const response = await this.fetchWithRetry(this.syncEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          data: localClients
        })
      });

      const result = await response.json();
      
      // Store last sync time
      localStorage.setItem('last_sync_time', result.timestamp);
      
      return { success: true, message: 'Sync completed successfully' };
    } catch (error: any) {
      console.error('Sync to cloud error:', error);
      return { success: false, message: error.message };
    }
  }

  async syncFromCloud() {
    try {
      const lastSyncTime = localStorage.getItem('last_sync_time');
      
      // Get updates from cloud
      const response = await this.fetchWithRetry(
        `${this.syncEndpoint}?userId=${this.userId}&lastSync=${lastSyncTime || ''}`,
        { method: 'GET' }
      );

      const { data, timestamp } = await response.json();

      // Update local storage with cloud data
      if (data && data.length > 0) {
        for (const client of data) {
          await this.clientStorage.updateClient(client.id, client, this.userId);
        }
      }

      // Update last sync time
      localStorage.setItem('last_sync_time', timestamp);
      
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
        console.error('Auto-sync failed:', syncResult.message);
      }
      // Get updates from cloud after pushing local changes
      if (syncResult.success) {
        await this.syncFromCloud();
      }
    }, intervalMinutes * 60 * 1000);
  }

  async initialSync() {
    const toCloudResult = await this.syncToCloud();
    if (!toCloudResult.success) {
      return false;
    }

    const fromCloudResult = await this.syncFromCloud();
    if (!fromCloudResult.success) {
      return false;
    }

    return true;
  }
}
