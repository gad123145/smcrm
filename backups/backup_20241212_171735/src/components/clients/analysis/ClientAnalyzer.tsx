import { useState } from 'react'
import { useGeminiAI } from '@/hooks/useGeminiAI'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Brain } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/integrations/supabase/client'
import { Client } from '@/data/clientsData'

interface ClientAnalyzerProps {
  client: Client
}

export function ClientAnalyzer({ client }: ClientAnalyzerProps) {
  const { t } = useTranslation()
  const { generateText, isLoading } = useGeminiAI()
  const [analysis, setAnalysis] = useState<{
    purchaseProbability: number
    bestContactTime: string
    recommendations: string[]
    nextSteps: string[]
  } | null>(null)

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
      `

      const response = await generateText(prompt)
      if (!response) throw new Error('فشل في تحليل بيانات العميل')

      // Parse the response
      const purchaseProbability = parseInt(response.match(/احتمالية الشراء: (\d+)/)?.[1] || '0')
      const bestContactTime = response.match(/أفضل وقت للتواصل: (.*?)(?:\n|$)/)?.[1] || ''
      
      const recommendations = response
        .match(/التوصيات:\n((?:- .*\n?)*)/)?.[1]
        ?.split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.replace('- ', '')) || []

      const nextSteps = response
        .match(/الخطوات التالية:\n((?:- .*\n?)*)/)?.[1]
        ?.split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.replace('- ', '')) || []

      const analysisData = {
        purchaseProbability,
        bestContactTime,
        recommendations,
        nextSteps
      }

      setAnalysis(analysisData)

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
        })

      if (error) throw error
      
      toast.success('تم تحليل بيانات العميل بنجاح')
    } catch (err) {
      console.error('Error analyzing client:', err)
      toast.error('حدث خطأ أثناء تحليل بيانات العميل')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          تحليل الذكاء الاصطناعي
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={analyzeClient}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          <span className="mr-2">تحليل</span>
        </Button>
      </CardHeader>
      <CardContent>
        {analysis ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">احتمالية الشراء:</span>
              <Badge 
                variant={
                  analysis.purchaseProbability > 70 ? "default" : 
                  analysis.purchaseProbability > 40 ? "secondary" : 
                  "destructive"
                }
              >
                {analysis.purchaseProbability}%
              </Badge>
            </div>
            
            <div>
              <span className="text-sm font-medium">أفضل وقت للتواصل:</span>
              <p className="mt-1 text-sm text-muted-foreground">
                {analysis.bestContactTime}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium">التوصيات:</span>
              <ul className="mt-1 space-y-1">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-sm font-medium">الخطوات التالية:</span>
              <ul className="mt-1 space-y-1">
                {analysis.nextSteps.map((step, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            اضغط على زر التحليل للحصول على توصيات ذكية حول هذا العميل
          </p>
        )}
      </CardContent>
    </Card>
  )
}