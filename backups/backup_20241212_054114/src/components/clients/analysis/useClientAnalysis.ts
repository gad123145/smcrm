import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Client } from "@/data/clientsData";
import { useGeminiAI } from "@/hooks/useGeminiAI";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ClientInsight {
  purchaseProbability: number;
  bestContactTime: string;
  recommendations: string[];
  nextSteps: string[];
}

export function useClientAnalysis(client: Client) {
  const { t } = useTranslation();
  const { generateText, isLoading } = useGeminiAI();
  const [insights, setInsights] = useState<ClientInsight | null>(null);

  const analyzeClient = async () => {
    try {
      const prompt = `
        تحليل بيانات العميل التالية وتقديم توصيات:
        - الاسم: ${client.name}
        - الحالة: ${client.status}
        - المشروع المهتم به: ${client.project || 'غير محدد'}
        - الميزانية: ${client.budget || 'غير محددة'}
        - تاريخ التسجيل: ${client.createdAt}
        - التعليقات: ${client.comments?.join(', ') || 'لا يوجد'}

        المطلوب:
        1. تقييم احتمالية الشراء (نسبة مئوية)
        2. اقتراح أفضل وقت للتواصل
        3. تقديم توصيات للتعامل مع العميل
        4. اقتراح الخطوات التالية

        قم بتنسيق الإجابة بالشكل التالي:
        احتمالية الشراء: [النسبة]
        أفضل وقت للتواصل: [الوقت]
        التوصيات:
        - [توصية 1]
        - [توصية 2]
        الخطوات التالية:
        - [خطوة 1]
        - [خطوة 2]
      `;

      const response = await generateText(prompt);
      if (!response) throw new Error('فشل في تحليل بيانات العميل');

      // Parse the response
      const purchaseProbability = parseInt(response.match(/احتمالية الشراء: (\d+)/)?.[1] || '0');
      const bestContactTime = response.match(/أفضل وقت للتواصل: (.*?)(?:\n|$)/)?.[1] || '';
      
      const recommendations = response
        .match(/التوصيات:\n((?:- .*\n?)*)/)?.[1]
        ?.split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.replace('- ', '')) || [];

      const nextSteps = response
        .match(/الخطوات التالية:\n((?:- .*\n?)*)/)?.[1]
        ?.split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.replace('- ', '')) || [];

      const analysisData = {
        purchaseProbability,
        bestContactTime,
        recommendations,
        nextSteps
      };

      setInsights(analysisData);

      // Save analysis to database
      const { error } = await supabase
        .from('client_insights')
        .upsert({
          client_id: client.id,
          purchase_probability: purchaseProbability,
          best_contact_time: bestContactTime,
          suggested_actions: { recommendations },
          next_steps: nextSteps,
          last_analysis: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success(t('clients.insights.analysisSuccess'));
      return analysisData;
    } catch (err) {
      console.error('Error analyzing client:', err);
      toast.error(t('clients.insights.analysisError'));
      return null;
    }
  };

  return {
    insights,
    setInsights,
    analyzeClient,
    isLoading
  };
}