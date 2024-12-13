import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getProjects } from "@/lib/storage";
import type { Project } from "@/types/types";

export function useProjects() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const projects = getProjects();
        return projects;
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error(isRTL ? 'حدث خطأ أثناء جلب المشاريع' : 'Error fetching projects');
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
}