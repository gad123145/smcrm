import { supabase } from '@/integrations/supabase/client';
import { useClientStore } from '@/stores/clientStore';
import { toast } from 'sonner';

export const initializeClientsSync = () => {
  // الاشتراك في تحديثات جدول العملاء
  const channel = supabase
    .channel('clients_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'clients'
      },
      async (payload) => {
        try {
          // تحديث البيانات في المخزن المحلي
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // جلب جميع العملاء المحدثين
          const { data: clients, error } = await supabase
            .from('clients')
            .select(`
              *,
              assigned_to_profile:profiles!assigned_to(full_name),
              created_by_profile:profiles!created_by(full_name)
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // تحديث المخزن المحلي
          useClientStore.getState().setClients(clients || []);

          // إظهار إشعار للمستخدم
          if (payload.eventType === 'INSERT') {
            toast.success('تم إضافة عميل جديد');
          } else if (payload.eventType === 'UPDATE') {
            toast.info('تم تحديث بيانات العميل');
          } else if (payload.eventType === 'DELETE') {
            toast.warning('تم حذف العميل');
          }
        } catch (error) {
          console.error('Error syncing clients:', error);
          toast.error('حدث خطأ في مزامنة بيانات العملاء');
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('تم الاشتراك في تحديثات العملاء بنجاح');
      }
    });

  // تنظيف الاشتراكات عند إغلاق التطبيق
  window.addEventListener('beforeunload', () => {
    supabase.removeChannel(channel);
  });

  return channel;
};
