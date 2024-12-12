import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { Project } from "@/types/project";

export function useProjectMutations() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const addProject = useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error(isRTL ? 'يجب تسجيل الدخول أولاً' : 'You must be logged in');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            ...projectData,
            user_id: session.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(isRTL ? 'تم إضافة المشروع بنجاح' : 'Project added successfully');
    },
    onError: (error: Error) => {
      console.error('Error adding project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء إضافة المشروع' : 'Error adding project');
    },
  });

  const updateProject = useMutation({
    mutationFn: async (project: Project) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error(isRTL ? 'يجب تسجيل الدخول أولاً' : 'You must be logged in');
      }

      const { error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', project.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(isRTL ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully');
    },
    onError: (error: Error) => {
      console.error('Error updating project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث المشروع' : 'Error updating project');
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error(isRTL ? 'يجب تسجيل الدخول أولاً' : 'You must be logged in');
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting project:', error);
      throw error; // Re-throw the error to be handled by the component
    },
  });

  return {
    addProject,
    updateProject,
    deleteProject,
  };
}