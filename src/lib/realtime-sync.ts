import { supabase } from "@/integrations/supabase/client";
import { useDataStore } from "@/stores/dataStore";
import { toast } from "sonner";

const tables = [
  'projects',
  'properties',
  'companies',
  'client_actions',
  'client_insights',
  'tasks',
  'notifications'
];

const tableActions = {
  'projects': {
    'INSERT': 'addProject',
    'UPDATE': 'updateProject',
    'DELETE': 'deleteProject'
  },
  'properties': {
    'INSERT': 'addProperty',
    'UPDATE': 'updateProperty',
    'DELETE': 'deleteProperty'
  },
  'companies': {
    'INSERT': 'addCompany',
    'UPDATE': 'updateCompany',
    'DELETE': 'deleteCompany'
  },
  'client_actions': {
    'INSERT': 'addClientAction',
    'UPDATE': 'updateClientAction',
    'DELETE': 'deleteClientAction'
  },
  'client_insights': {
    'INSERT': 'addClientInsight',
    'UPDATE': 'updateClientInsight',
    'DELETE': 'deleteClientInsight'
  },
  'tasks': {
    'INSERT': 'addTask',
    'UPDATE': 'updateTask',
    'DELETE': 'deleteTask'
  },
  'notifications': {
    'INSERT': 'addNotification',
    'UPDATE': 'updateNotification',
    'DELETE': 'deleteNotification'
  }
};

export const initializeRealtimeSync = () => {
  const channel = supabase.channel('db-changes');

  tables.forEach(table => {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table
      },
      (payload) => {
        const store = useDataStore.getState();
        try {
          switch (payload.eventType) {
            case 'INSERT':
              store[tableActions[table]['INSERT']](payload.new);
              toast.success(`تم إضافة ${table} جديد`);
              break;
            case 'UPDATE':
              store[tableActions[table]['UPDATE']](payload.new);
              toast.success(`تم تحديث ${table}`);
              break;
            case 'DELETE':
              store[tableActions[table]['DELETE']](payload.old.id);
              toast.success(`تم حذف ${table}`);
              break;
          }
        } catch (error) {
          console.error(`Error handling ${table} change:`, error);
          toast.error(`حدث خطأ في مزامنة ${table}`);
        }
      }
    );
  });

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('تم الاشتراك في تحديثات الجداول بنجاح');
    } else if (status === 'CHANNEL_ERROR') {
      console.error('Failed to subscribe to real-time changes');
      toast.error('فشل في الاتصال بالمزامنة في الوقت الفعلي');
    }
  });

  // تنظيف الاشتراك عند إغلاق التطبيق
  window.addEventListener('beforeunload', () => {
    supabase.removeChannel(channel);
  });

  return channel;
};
