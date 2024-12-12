import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { Project } from "@/types/project";

export function useProjects() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast.error(isRTL ? 'يجب تسجيل الدخول أولاً' : 'You must be logged in');
          return [];
        }

        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          toast.error(isRTL ? 'خطأ في تحميل المشروعات' : 'Error loading projects');
          throw projectsError;
        }

        return projects as Project[];
      } catch (error) {
        console.error('Error in useProjects:', error);
        toast.error(isRTL ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data');
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
}