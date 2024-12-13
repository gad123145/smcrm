import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import i18next from 'i18next';

const tables = [
  'clients',
  'companies',
  'properties',
  'projects',
  'tasks',
  'notes',
  'documents',
  'activities',
  'notifications',
  'ai_project_insights'
];

export class RealtimeSync {
  private subscriptions: { [key: string]: any } = {};
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private t(key: string) {
    return i18next.t(key);
  }

  startRealtimeSync() {
    tables.forEach(table => {
      this.subscribeToTable(table);
    });

    // Subscribe to user profile changes
    this.subscribeToProfile();
  }

  private subscribeToTable(table: string) {
    this.subscriptions[table] = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: table,
          filter: `user_id=eq.${this.userId}` // Only listen to changes for current user
        },
        async (payload) => {
          console.log(`Realtime change in ${table}:`, payload);
          
          // Handle the change based on the event type
          switch (payload.eventType) {
            case 'INSERT':
              toast.success(this.t('sync.dataAdded', { table }));
              break;
            case 'UPDATE':
              toast.success(this.t('sync.dataUpdated', { table }));
              break;
            case 'DELETE':
              toast.success(this.t('sync.dataDeleted', { table }));
              break;
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to ${table} changes`);
        }
      });
  }

  private subscribeToProfile() {
    this.subscriptions['profile'] = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${this.userId}`
        },
        async (payload) => {
          console.log('Profile change:', payload);
          if (payload.eventType === 'UPDATE') {
            toast.success(this.t('sync.profileUpdated'));
          }
        }
      )
      .subscribe();
  }

  stopRealtimeSync() {
    Object.values(this.subscriptions).forEach(subscription => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    });
    this.subscriptions = {};
  }
}
