import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { addProject, updateProject as updateProjectStorage, deleteProject as deleteProjectStorage } from "@/lib/storage";
import type { Project } from "@/types/types";

export function useProjectMutations() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const createProject = useMutation({
    mutationFn: async (newProject: Omit<Project, 'id'>) => {
      const result = await addProject(newProject);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(isRTL ? 'تم إنشاء المشروع بنجاح' : 'Project created successfully');
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء إنشاء المشروع' : 'Error creating project');
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const result = await updateProjectStorage(id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(isRTL ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully');
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث المشروع' : 'Error updating project');
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProjectStorage(id);
      if (result.error) {
        throw new Error(result.error);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(isRTL ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حذف المشروع' : 'Error deleting project');
    },
  });

  return {
    createProject,
    updateProject,
    deleteProject,
  };
}