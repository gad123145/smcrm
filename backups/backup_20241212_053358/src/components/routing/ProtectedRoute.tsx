import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (error.message.includes('Invalid Refresh Token')) {
            await supabase.auth.signOut();
            toast.error("جلستك انتهت. يرجى تسجيل الدخول مرة أخرى.");
          }
          setIsAuthenticated(false);
          return;
        }

        if (session?.user) {
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Profile check error:", profileError);
          }

          // If no profile exists, create one
          if (!profile) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                full_name: session.user.user_metadata.full_name,
                role: 'employee',
                status: 'active'
              });

            if (insertError) {
              console.error("Profile creation error:", insertError);
              toast.error("حدث خطأ أثناء إنشاء الملف الشخصي");
            }
          }
        }
        
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(!!session);
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}