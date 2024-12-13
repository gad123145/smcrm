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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
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
    // التحقق من حالة المصادقة الحالية
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
        
        if (user) {
          // تهيئة المزامنة في الوقت الفعلي فقط إذا كان المستخدم مسجل الدخول
          const realtimeChannel = initializeRealtimeSync();
          const clientsChannel = initializeClientsSync();

          // جلب بيانات العملاء الأولية
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

          // تنظيف عند إلغاء التحميل
          return () => {
            supabase.removeChannel(realtimeChannel);
            supabase.removeChannel(clientsChannel);
          };
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        toast.error('حدث خطأ في التحقق من المصادقة');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // التحقق من حالة المصادقة
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        toast.success('تم تسجيل الدخول بنجاح');
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        useClientStore.getState().setClients([]);
        queryClient.clear();
        toast.info('تم تسجيل الخروج');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const handleAuthError = () => {
    supabase.auth.signOut();
    queryClient.clear();
    useClientStore.getState().setClients([]);
    setIsAuthenticated(false);
    toast.error('انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRoutes isAuthenticated={isAuthenticated} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;