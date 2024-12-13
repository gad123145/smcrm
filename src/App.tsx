import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./i18n/config";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { initializeRealtimeSync } from "@/lib/realtime-sync";
import { useDataStore } from "@/stores/dataStore";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchInitialData = useDataStore(state => state.fetchInitialData);
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
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
    let mounted = true;
    let realtimeChannel: any = null;

    const checkAuth = async () => {
      try {
        setError(null);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (mounted) {
          const isAuthed = !!session?.user;
          setIsAuthenticated(isAuthed);
          
          if (isAuthed) {
            try {
              // تهيئة المزامنة في الوقت الفعلي
              realtimeChannel = initializeRealtimeSync();
              // جلب البيانات الأولية
              await fetchInitialData();
            } catch (dataError) {
              console.error('Error fetching initial data:', dataError);
              toast.error('حدث خطأ في جلب البيانات الأولية');
            }
          }
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        if (mounted) {
          if (error.message === 'Auth session missing!') {
            // تجاهل خطأ جلسة المصادقة المفقودة وتوجيه المستخدم لتسجيل الدخول
            setIsAuthenticated(false);
          } else {
            setError(error.message);
            toast.error('حدث خطأ في التحقق من المصادقة');
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    // تنظيف عند إلغاء التحميل
    return () => {
      mounted = false;
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [fetchInitialData]);

  // مراقبة حالة المصادقة
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setIsLoading(true);
        try {
          await fetchInitialData();
          toast.success('تم تسجيل الدخول بنجاح');
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('حدث خطأ في جلب البيانات');
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
        useDataStore.getState().reset();
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
    useDataStore.getState().reset();
    setIsAuthenticated(false);
    toast.error('انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.');
  };

  if (error && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">حدث خطأ: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <div className="ml-4 text-xl">جاري التحميل...</div>
      </div>
    );
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