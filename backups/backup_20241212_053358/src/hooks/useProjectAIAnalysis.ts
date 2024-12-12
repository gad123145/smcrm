import { useState } from "react";
import { useGeminiAI } from "./useGeminiAI";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Project } from "@/types/project";

interface ProjectAnalysis {
  investmentScore: number;
  marketTrends: string[];
  recommendations: string[];
  socialPost: string;
}

export function useProjectAIAnalysis(project: Project) {
  const { generateText, isLoading } = useGeminiAI();
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);

  const analyzeProject = async () => {
    try {
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('يجب تسجيل الدخول لتحليل المشروع');
        return;
      }

      const prompt = `
        تحليل بيانات المشروع العقاري التالي وتقديم توصيات:
        - الاسم: ${project.name}
        - الموقع: ${project.location || 'غير محدد'}
        - السعر: ${project.price || 'غير محدد'}
        - المساحة: ${project.project_area || 'غير محددة'}
        - عدد الوحدات المتاحة: ${project.available_units || 'غير محدد'}
        - نسبة الإنجاز: ${project.progress || 0}%

        المطلوب:
        1. تقييم جاذبية الاستثمار (نسبة مئوية)
        2. تحليل اتجاهات السوق
        3. تقديم توصيات للمستثمرين
        4. اقتراح منشور مناسب لوسائل التواصل الاجتماعي للترويج للمشروع
      `;

      const response = await generateText(prompt, {
        entityType: 'project',
        entityId: project.id
      });
      
      if (!response) throw new Error('فشل في تحليل بيانات المشروع');

      // Parse AI response
      const investmentScore = parseInt(response.match(/جاذبية الاستثمار: (\d+)/)?.[1] || '0');
      const marketTrends = response
        .match(/اتجاهات السوق:\n((?:- .*\n?)*)/)?.[1]
        ?.split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.replace('- ', '')) || [];

      const recommendations = response
        .match(/التوصيات:\n((?:- .*\n?)*)/)?.[1]
        ?.split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.replace('- ', '')) || [];

      const socialPost = response.match(/منشور التواصل الاجتماعي:(.*?)(?:\n|$)/s)?.[1]?.trim() || '';

      const analysisData = {
        investmentScore,
        marketTrends,
        recommendations,
        socialPost
      };

      setAnalysis(analysisData);

      // Save analysis to database with user_id
      const { error } = await supabase
        .from('ai_project_insights')
        .upsert({
          project_id: project.id,
          analysis_data: analysisData,
          last_analysis: new Date().toISOString(),
          user_id: session.user.id // Important: Set the user_id
        });

      if (error) throw error;
      
      toast.success('تم تحليل بيانات المشروع بنجاح');
    } catch (err) {
      console.error('Error analyzing project:', err);
      toast.error('حدث خطأ أثناء تحليل بيانات المشروع');
    }
  };

  return {
    analysis,
    isLoading,
    analyzeProject
  };
}