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

      console.log('Starting project deletion for ID:', projectId);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error('No active session found');
        throw new Error(isRTL ? 'يجب تسجيل الدخول أولاً' : 'You must be logged in');
      }

      console.log('User session found:', session.user.id);

      // First check if the project exists and belongs to the user
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          developer:developer_id (
            id,
            name
          ),
          project_units (
            id
          )
        `)
        .eq('id', projectId)
        .single();

      if (fetchError) {
        console.error('Error fetching project:', fetchError);
        throw new Error(isRTL ? 'لم يتم العثور على المشروع' : 'Project not found');
      }

      if (!project) {
        console.error('Project not found:', projectId);
        throw new Error(isRTL ? 'المشروع غير موجود' : 'Project does not exist');
      }

      console.log('Project found:', project);

      // Check if the user has permission to delete this project
      if (project.user_id !== session.user.id) {
        console.error('Permission denied. Project user_id:', project.user_id, 'Session user_id:', session.user.id);
        throw new Error(isRTL ? 'ليس لديك صلاحية لحذف هذا المشروع' : 'You do not have permission to delete this project');
      }

      // First, try to delete any related project_units
      if (project.project_units && project.project_units.length > 0) {
        console.log('Deleting related project units...');
        const { error: unitsDeleteError } = await supabase
          .from('project_units')
          .delete()
          .eq('project_id', projectId);

        if (unitsDeleteError) {
          console.error('Error deleting project units:', unitsDeleteError);
          throw new Error(isRTL ? 'خطأ في حذف الوحدات المرتبطة' : 'Error deleting related units');
        }
      }

      // Then delete any related files from storage
      if (project.images && project.images.length > 0) {
        console.log('Deleting project images from storage...');
        for (const imageUrl of project.images) {
          const imagePath = imageUrl.split('/').pop();
          if (imagePath) {
            const { error: storageError } = await supabase.storage
              .from('projects')
              .remove([imagePath]);
            
            if (storageError) {
              console.warn('Error deleting image:', imagePath, storageError);
            }
          }
        }
      }

      // Finally, delete the project itself
      console.log('Deleting project record...');
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', session.user.id);

      if (deleteError) {
        console.error('Error deleting project:', deleteError);
        if (deleteError.code === '23503') {
          throw new Error(isRTL ? 'لا يمكن حذف المشروع لوجود بيانات مرتبطة به' : 'Cannot delete project due to related data');
        } else if (deleteError.code === '42501') {
          throw new Error(isRTL ? 'ليس لديك صلاحية لحذف هذا المشروع' : 'You do not have permission to delete this project');
        }
        throw deleteError;
      }

      console.log('Project deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(isRTL ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Error in deleteProject mutation:', error);
      toast.error(error.message || (isRTL ? 'حدث خطأ أثناء حذف المشروع' : 'Error deleting project'));
    },
  });

  return {
    addProject,
    updateProject,
    deleteProject,
  };
}