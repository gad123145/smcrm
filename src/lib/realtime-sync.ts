import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const tables = [
  'clients',
  'projects',
  'properties',
  'companies',
  'client_actions',
  'client_insights',
  'tasks',
  'notifications'
];

export const initializeRealtimeSync = () => {
  tables.forEach(table => {
    const channel = supabase
      .channel(`${table}_sync`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          // تحديث البيانات في الوقت الفعلي
          console.log(`تم تحديث البيانات في جدول ${table}:`, payload);
          
          // إظهار إشعار للمستخدم
          if (payload.eventType === 'INSERT') {
            toast.success(`تم إضافة عنصر جديد في ${table}`);
          } else if (payload.eventType === 'UPDATE') {
            toast.info(`تم تحديث عنصر في ${table}`);
          } else if (payload.eventType === 'DELETE') {
            toast.warning(`تم حذف عنصر من ${table}`);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`تم الاشتراك في تحديثات ${table} بنجاح`);
        }
      });

    // تنظيف الاشتراكات عند إغلاق التطبيق
    window.addEventListener('beforeunload', () => {
      supabase.removeChannel(channel);
    });
  });
};
