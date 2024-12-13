import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useImageGeneration() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = async (prompt: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      })

      if (error) throw error

      return data.image
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateImage,
    isLoading,
    error
  }
}