import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import i18next from 'i18next';

export interface SyncService {
  syncData: () => Promise<void>;
  getLastSyncTime: () => Promise<Date | null>;
}

export class SupabaseSync implements SyncService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private t(key: string) {
    return i18next.t(key);
  }

  async syncData(): Promise<void> {
    try {
      // Start sync
      await this.createSyncLog('in_progress');

      // 1. Sync Clients
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', this.userId);
      if (clientsError) throw clientsError;

      // 2. Sync Companies
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', this.userId);
      if (companiesError) throw companiesError;

      // 3. Sync Properties
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', this.userId);
      if (propertiesError) throw propertiesError;

      // 4. Sync Projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', this.userId);
      if (projectsError) throw projectsError;

      // 5. Sync Tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', this.userId);
      if (tasksError) throw tasksError;

      // 6. Sync Notes
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', this.userId);
      if (notesError) throw notesError;

      // 7. Sync Documents
      const { data: documents, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', this.userId);
      if (documentsError) throw documentsError;

      // 8. Sync Activities
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', this.userId);
      if (activitiesError) throw activitiesError;

      // 9. Sync Notifications
      const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', this.userId);
      if (notificationsError) throw notificationsError;

      // 10. Sync User Settings
      const { data: settings, error: settingsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.userId)
        .single();
      if (settingsError) throw settingsError;

      // 11. Sync AI Project Insights
      const { data: insights, error: insightsError } = await supabase
        .from('ai_project_insights')
        .select('*')
        .eq('user_id', this.userId);
      if (insightsError) throw insightsError;

      // Update sync status on success
      const syncResults = {
        clients: clients?.length || 0,
        companies: companies?.length || 0,
        properties: properties?.length || 0,
        projects: projects?.length || 0,
        tasks: tasks?.length || 0,
        notes: notes?.length || 0,
        documents: documents?.length || 0,
        activities: activities?.length || 0,
        notifications: notifications?.length || 0,
        insights: insights?.length || 0
      };
      await this.createSyncLog('success', syncResults);
      toast.success(this.t('sync.success'));
    } catch (error) {
      console.error('Sync error:', error);
      await this.createSyncLog('error', null, error.message);
      toast.error(this.t('sync.error'));
    }
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

  private async createSyncLog(status: string = 'success', details: any = null, errorDetails: string | null = null): Promise<void> {
    try {
      const { error } = await supabase
        .from('sync_logs')
        .insert({
          user_id: this.userId,
          status,
          details,
          error_details: errorDetails,
          last_sync: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating sync log:', error);
      }
    } catch (error) {
      console.error('Error creating sync log:', error);
    }
  }
}
