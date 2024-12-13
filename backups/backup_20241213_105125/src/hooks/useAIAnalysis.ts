import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAIAnalysis() {
  const analyzeEntity = useCallback(async (entity: {
    id: string;
    type: 'company' | 'project';
    name: string;
    description?: string;
    [key: string]: any;
  }) => {
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('analyze-entity', {
        body: { entity }
      });

      if (functionError) throw functionError;

      return functionData.analysis;
    } catch (error) {
      console.error('Error analyzing entity:', error);
      toast.error('حدث خطأ أثناء تحليل البيانات');
      return null;
    }
  }, []);

  const getEntityAnalysis = useCallback(async (entityType: 'company' | 'project', entityId: string) => {
    try {
      const { data, error } = await supabase
        .from(entityType === 'company' ? 'ai_company_insights' : 'ai_project_insights')
        .select('analysis_data')
        .eq(entityType === 'company' ? 'company_id' : 'project_id', entityId)
        .single();

      if (error) throw error;
      return data?.analysis_data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      return null;
    }
  }, []);

  return {
    analyzeEntity,
    getEntityAnalysis
  };
}