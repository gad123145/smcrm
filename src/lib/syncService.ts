import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import i18next from 'i18next';

export interface SyncService {
  syncData: () => Promise<void>;
  getLastSyncTime: () => Promise<Date | null>;
}

export class SupabaseSync implements SyncService {
  private userId: string;
  private maxRetries = 3;

  constructor(userId: string) {
    this.userId = userId;
  }

  private t(key: string) {
    return i18next.t(key);
  }

  private async createSyncLog(status: 'in_progress' | 'success' | 'error', error?: string) {
    try {
      const { error: logError } = await supabase
        .from('sync_logs')
        .insert({
          user_id: this.userId,
          status,
          last_sync: new Date().toISOString(),
          error_details: error
        });
      if (logError) console.error('Error creating sync log:', logError);
    } catch (err) {
      console.error('Failed to create sync log:', err);
    }
  }

  async syncData(): Promise<void> {
    let retryCount = 0;
    
    while (retryCount < this.maxRetries) {
      try {
        await this.createSyncLog('in_progress');
        
        // Perform all sync operations
        const syncOperations = [
          this.syncTable('clients'),
          this.syncTable('companies'),
          this.syncTable('properties'),
          this.syncTable('projects'),
          this.syncTable('tasks'),
          this.syncTable('notes'),
          this.syncTable('documents'),
          this.syncTable('activities'),
          this.syncTable('notifications'),
          this.syncTable('ai_project_insights'),
          this.syncUserSettings()
        ];

        await Promise.all(syncOperations);
        
        // If successful, create success log and break
        await this.createSyncLog('success');
        toast.success(this.t('sync.success'));
        break;
      } catch (error) {
        retryCount++;
        console.error(`Sync attempt ${retryCount} failed:`, error);
        
        if (retryCount === this.maxRetries) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          await this.createSyncLog('error', errorMessage);
          toast.error(this.t('sync.error'));
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }
  }

  private async syncTable(tableName: string) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', this.userId);
      
    if (error) {
      console.error(`Error syncing ${tableName}:`, error);
      throw error;
    }
    
    return data;
  }

  private async syncUserSettings() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', this.userId)
      .single();
      
    if (error) {
      console.error('Error syncing user settings:', error);
      throw error;
    }
    
    return data;
  }

  async getLastSyncTime(): Promise<Date | null> {
    try {
      const { data, error } = await supabase
        .from('sync_logs')
        .select('last_sync, status, details')
        .eq('user_id', this.userId)
        .order('last_sync', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === '42P01') { // Table does not exist
          return null;
        }
        console.error('Error getting last sync time:', error);
        return null;
      }

      return data?.last_sync ? new Date(data.last_sync) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }
}
