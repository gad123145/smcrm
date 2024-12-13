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
        if (!payload) return;
        
        try {
          // تحديث البيانات في المخزن المحلي
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.warn('User not authenticated');
            return;
          }

          // تحديث المخزن المحلي بناءً على نوع الحدث
          const clientStore = useClientStore.getState();
          
          if (payload.eventType === 'INSERT' && payload.new) {
            clientStore.addClient(payload.new);
            toast.success('تم إضافة عميل جديد');
          } 
          else if (payload.eventType === 'UPDATE' && payload.new) {
            clientStore.updateClient(payload.new);
            toast.info('تم تحديث بيانات العميل');
          } 
          else if (payload.eventType === 'DELETE' && payload.old) {
            clientStore.deleteClient(payload.old.id);
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

  // تنظيف الاشتراك عند إغلاق التطبيق
  window.addEventListener('beforeunload', () => {
    supabase.removeChannel(channel);
  });

  return channel;
};
