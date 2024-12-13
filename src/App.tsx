import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./i18n/config";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { initializeRealtimeSync } from "@/lib/realtime-sync";
import { initializeClientsSync } from "@/lib/clients-sync";
import { useClientStore } from "@/stores/clientStore";

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        meta: {
          onError: (error: any) => {
            if (error?.message?.includes('Invalid Refresh Token')) {
              handleAuthError();
            }
          },
        }
      }
    }
  }));

  useEffect(() => {
    // تهيئة المزامنة في الوقت الفعلي
    const realtimeChannel = initializeRealtimeSync();
    const clientsChannel = initializeClientsSync();
    
    // التحقق من حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // عند تسجيل الدخول، قم بجلب بيانات العملاء
        if (session?.user?.id) {
          try {
            const { data: clients, error } = await supabase
              .from('clients')
              .select(`
                *,
                assigned_to_profile:profiles!assigned_to(full_name),
                created_by_profile:profiles!created_by(full_name)
              `)
              .order('created_at', { ascending: false });

            if (error) throw error;
            useClientStore.getState().setClients(clients || []);
          } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('حدث خطأ في جلب بيانات العملاء');
          }
        }
        toast.success('تم تسجيل الدخول بنجاح');
      } else if (event === 'SIGNED_OUT') {
        // عند تسجيل الخروج، قم بمسح بيانات العملاء
        useClientStore.getState().setClients([]);
        queryClient.clear();
        toast.info('تم تسجيل الخروج');
      }
    });

    // تنظيف الموارد عند إغلاق التطبيق
    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(realtimeChannel);
      supabase.removeChannel(clientsChannel);
    };
  }, [queryClient]);

  const handleAuthError = () => {
    supabase.auth.signOut();
    queryClient.clear();
    useClientStore.getState().setClients([]);
    toast.error('انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AppRoutes />
          <Toaster />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;