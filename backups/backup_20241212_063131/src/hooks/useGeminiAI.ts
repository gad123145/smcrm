import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface GenerateTextOptions {
  entityType?: 'company' | 'project';
  entityId?: string;
}

export function useGeminiAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateText = async (prompt: string, options?: GenerateTextOptions) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('يجب تسجيل الدخول لاستخدام هذه الميزة')
      }

      const response = await supabase.functions.invoke('generate-with-gemini', {
        body: { 
          prompt,
          entityType: options?.entityType,
          entityId: options?.entityId
        }
      })

      if (response.error) {
        console.error('Error from Edge Function:', response.error)
        
        // Handle 404 specifically for missing entity data
        if (response.error.status === 404) {
          throw new Error('لم يتم العثور على البيانات المطلوبة للكيان المحدد')
        }
        
        throw new Error(response.error.message || 'حدث خطأ في توليد النص')
      }

      const { data } = response
      if (!data?.generatedText) {
        throw new Error('لم يتم توليد أي نص')
      }

      return data.generatedText
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateText,
    isLoading,
    error
  }
}