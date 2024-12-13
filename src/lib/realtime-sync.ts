import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  tables.forEach(table => {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table
      },
      (payload) => {
        if (!payload) return;

        try {
          // تحديث البيانات في الوقت الفعلي
          console.log(`تم تحديث البيانات في جدول ${table}:`, payload);
          
          // إظهار إشعار للمستخدم
          if (payload.eventType === 'INSERT' && payload.new) {
            toast.success(`تم إضافة عنصر جديد في ${table}`);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            toast.info(`تم تحديث عنصر في ${table}`);
          } else if (payload.eventType === 'DELETE' && payload.old) {
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
