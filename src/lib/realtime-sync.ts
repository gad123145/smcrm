import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDataStore } from '@/stores/dataStore';

const tables = [
  'projects',
  'properties',
  'companies',
  'client_actions',
  'client_insights',
  'tasks',
  'notifications'
];

export const initializeRealtimeSync = () => {
  const channel = supabase.channel('general_sync');
  const dataStore = useDataStore.getState();

  tables.forEach(table => {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table
      },
      async (payload) => {
        if (!payload) return;

        try {
          // تحديث المخزن المحلي بناءً على نوع الحدث والجدول
          if (payload.eventType === 'INSERT' && payload.new) {
            switch (table) {
              case 'projects':
                dataStore.setProjects([payload.new, ...dataStore.projects]);
                break;
              case 'properties':
                dataStore.setProperties([payload.new, ...dataStore.properties]);
                break;
              case 'companies':
                dataStore.setCompanies([payload.new, ...dataStore.companies]);
                break;
              case 'client_actions':
                dataStore.setClientActions([payload.new, ...dataStore.clientActions]);
                break;
              case 'client_insights':
                dataStore.setClientInsights([payload.new, ...dataStore.clientInsights]);
                break;
              case 'tasks':
                dataStore.setTasks([payload.new, ...dataStore.tasks]);
                break;
              case 'notifications':
                dataStore.setNotifications([payload.new, ...dataStore.notifications]);
                break;
            }
            toast.success(`تم إضافة عنصر جديد في ${table}`);
          } 
          else if (payload.eventType === 'UPDATE' && payload.new) {
            switch (table) {
              case 'projects':
                dataStore.setProjects(
                  dataStore.projects.map(item => 
                    item.id === payload.new.id ? payload.new : item
                  )
                );
                break;
              case 'properties':
                dataStore.setProperties(
                  dataStore.properties.map(item => 
                    item.id === payload.new.id ? payload.new : item
                  )
                );
                break;
              case 'companies':
                dataStore.setCompanies(
                  dataStore.companies.map(item => 
                    item.id === payload.new.id ? payload.new : item
                  )
                );
                break;
              case 'client_actions':
                dataStore.setClientActions(
                  dataStore.clientActions.map(item => 
                    item.id === payload.new.id ? payload.new : item
                  )
                );
                break;
              case 'client_insights':
                dataStore.setClientInsights(
                  dataStore.clientInsights.map(item => 
                    item.id === payload.new.id ? payload.new : item
                  )
                );
                break;
              case 'tasks':
                dataStore.setTasks(
                  dataStore.tasks.map(item => 
                    item.id === payload.new.id ? payload.new : item
                  )
                );
                break;
              case 'notifications':
                dataStore.setNotifications(
                  dataStore.notifications.map(item => 
                    item.id === payload.new.id ? payload.new : item
                  )
                );
                break;
            }
            toast.info(`تم تحديث عنصر في ${table}`);
          } 
          else if (payload.eventType === 'DELETE' && payload.old) {
            switch (table) {
              case 'projects':
                dataStore.setProjects(
                  dataStore.projects.filter(item => item.id !== payload.old.id)
                );
                break;
              case 'properties':
                dataStore.setProperties(
                  dataStore.properties.filter(item => item.id !== payload.old.id)
                );
                break;
              case 'companies':
                dataStore.setCompanies(
                  dataStore.companies.filter(item => item.id !== payload.old.id)
                );
                break;
              case 'client_actions':
                dataStore.setClientActions(
                  dataStore.clientActions.filter(item => item.id !== payload.old.id)
                );
                break;
              case 'client_insights':
                dataStore.setClientInsights(
                  dataStore.clientInsights.filter(item => item.id !== payload.old.id)
                );
                break;
              case 'tasks':
                dataStore.setTasks(
                  dataStore.tasks.filter(item => item.id !== payload.old.id)
                );
                break;
              case 'notifications':
                dataStore.setNotifications(
                  dataStore.notifications.filter(item => item.id !== payload.old.id)
                );
                break;
            }
            toast.warning(`تم حذف عنصر من ${table}`);
          }
        } catch (error) {
          console.error(`Error syncing ${table}:`, error);
          toast.error(`حدث خطأ في مزامنة ${table}`);
        }
      }
    );
  });

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('تم الاشتراك في تحديثات الجداول بنجاح');
    }
  });

  // تنظيف الاشتراك عند إغلاق التطبيق
  window.addEventListener('beforeunload', () => {
    supabase.removeChannel(channel);
  });

  return channel;
};
