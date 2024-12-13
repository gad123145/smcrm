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
import { useDataStore } from "@/stores/dataStore";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchInitialData = useDataStore(state => state.fetchInitialData);
  
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

          // جلب البيانات الأولية
          await fetchInitialData();

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
  }, [fetchInitialData]);

  // التحقق من حالة المصادقة
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        await fetchInitialData();
        toast.success('تم تسجيل الدخول بنجاح');
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        useClientStore.getState().setClients([]);
        useDataStore.getState().setProjects([]);
        useDataStore.getState().setProperties([]);
        useDataStore.getState().setCompanies([]);
        queryClient.clear();
        toast.info('تم تسجيل الخروج');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, fetchInitialData]);

  const handleAuthError = () => {
    supabase.auth.signOut();
    queryClient.clear();
    useClientStore.getState().setClients([]);
    useDataStore.getState().setProjects([]);
    useDataStore.getState().setProperties([]);
    useDataStore.getState().setCompanies([]);
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