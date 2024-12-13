import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./i18n/config";
import { Toaster } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { supabase } from "@/integrations/supabase/client";
import { useDataStore } from "@/stores/dataStore";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchInitialData = useDataStore(state => state.fetchInitialData);
  const reset = useDataStore(state => state.reset);
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
      }
    }
  }));

  const handleAuthStateChange = useCallback(async (event: string, session: any) => {
    if (event === 'SIGNED_IN' && session?.user) {
      setIsAuthenticated(true);
      setIsLoading(true);
      try {
        await fetchInitialData();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      setIsAuthenticated(false);
      reset();
      queryClient.clear();
    }
  }, [fetchInitialData, queryClient, reset]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            await handleAuthStateChange('SIGNED_IN', session);
          } else {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing:', error);
        if (mounted) {
          setError('حدث خطأ في تهيئة التطبيق');
          setIsLoading(false);
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          إعادة تحميل التطبيق
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-gray-600 text-lg">جاري تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRoutes isAuthenticated={isAuthenticated} />
        <Toaster position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;