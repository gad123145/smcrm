import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./i18n/config";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        },
      },
    },
  }));

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        queryClient.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const handleAuthError = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.clear();
      toast.error("جلستك انتهت. يرجى تسجيل الدخول مرة أخرى.");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;