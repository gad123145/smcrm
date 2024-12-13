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
      async (payload) => {
        try {
          const store = useDataStore.getState();
          
          if (payload.eventType === 'INSERT') {
            switch (table) {
              case 'projects':
                store.addProject(payload.new);
                toast.success('تم إضافة مشروع جديد');
                break;
              case 'properties':
                store.addProperty(payload.new);
                toast.success('تم إضافة عقار جديد');
                break;
              case 'companies':
                store.addCompany(payload.new);
                toast.success('تم إضافة شركة جديدة');
                break;
              case 'client_actions':
                store.addClientAction(payload.new);
                toast.success('تم إضافة إجراء عميل جديد');
                break;
              case 'client_insights':
                store.addClientInsight(payload.new);
                toast.success('تم إضافة رؤية عميل جديدة');
                break;
              case 'tasks':
                store.addTask(payload.new);
                toast.success('تم إضافة مهمة جديدة');
                break;
              case 'notifications':
                store.addNotification(payload.new);
                toast.success('تم إضافة إشعار جديد');
                break;
            }
          } else if (payload.eventType === 'UPDATE') {
            switch (table) {
              case 'projects':
                store.updateProject(payload.new);
                toast.success('تم تحديث المشروع');
                break;
              case 'properties':
                store.updateProperty(payload.new);
                toast.success('تم تحديث العقار');
                break;
              case 'companies':
                store.updateCompany(payload.new);
                toast.success('تم تحديث الشركة');
                break;
              case 'client_actions':
                store.updateClientAction(payload.new);
                toast.success('تم تحديث إجراء عميل');
                break;
              case 'client_insights':
                store.updateClientInsight(payload.new);
                toast.success('تم تحديث رؤية عميل');
                break;
              case 'tasks':
                store.updateTask(payload.new);
                toast.success('تم تحديث المهمة');
                break;
              case 'notifications':
                store.updateNotification(payload.new);
                toast.success('تم تحديث الإشعار');
                break;
            }
          } else if (payload.eventType === 'DELETE') {
            switch (table) {
              case 'projects':
                store.deleteProject(payload.old.id);
                toast.success('تم حذف المشروع');
                break;
              case 'properties':
                store.deleteProperty(payload.old.id);
                toast.success('تم حذف العقار');
                break;
              case 'companies':
                store.deleteCompany(payload.old.id);
                toast.success('تم حذف الشركة');
                break;
              case 'client_actions':
                store.deleteClientAction(payload.old.id);
                toast.success('تم حذف إجراء عميل');
                break;
              case 'client_insights':
                store.deleteClientInsight(payload.old.id);
                toast.success('تم حذف رؤية عميل');
                break;
              case 'tasks':
                store.deleteTask(payload.old.id);
                toast.success('تم حذف المهمة');
                break;
              case 'notifications':
                store.deleteNotification(payload.old.id);
                toast.success('تم حذف الإشعار');
                break;
            }
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
