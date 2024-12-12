import { useState } from 'react'
import { useGeminiAI } from '@/hooks/useGeminiAI'
import { useImageGeneration } from '@/hooks/useImageGeneration'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { useTranslation } from 'react-i18next'
import { AIHeader } from './ai/AIHeader'
import { AITabs } from './ai/AITabs'

export function AIAssistant() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const { generateText, isLoading: isLoadingText, error: textError } = useGeminiAI()
  const { generateImage, isLoading: isLoadingImage, error: imageError } = useImageGeneration()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast.error(isRTL ? 'الرجاء إدخال نص للسؤال' : 'Please enter a question')
      return
    }

    const response = await generateText(prompt)
    if (response) {
      setIsTyping(true)
      let displayedText = ''
      const textArray = response.split('')
      
      for (let i = 0; i < textArray.length; i++) {
        displayedText += textArray[i]
        setResult(displayedText)
        await new Promise(resolve => setTimeout(resolve, 20))
      }
      
      setIsTyping(false)
      toast.success(isRTL ? 'تم توليد النص بنجاح' : 'Text generated successfully')
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.id) {
          toast.error(isRTL ? 'يجب تسجيل الدخول لحفظ المحادثة' : 'Login required to save conversation')
          return
        }

        const { error } = await supabase
          .from('ai_conversations')
          .insert({
            prompt,
            response,
            user_id: session.user.id
          })
        
        if (error) throw error
      } catch (err) {
        toast.error(isRTL ? 'فشل في حفظ المحادثة' : 'Failed to save conversation')
      }
    }
  }

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error(isRTL ? 'الرجاء إدخال وصف للصورة' : 'Please enter an image description')
      return
    }

    const image = await generateImage(prompt)
    if (image) {
      setGeneratedImage(image)
      toast.success(isRTL ? 'تم توليد الصورة بنجاح' : 'Image generated successfully')
    }
  }

  const handleClear = () => {
    setPrompt('')
    setResult('')
    setGeneratedImage(null)
    toast.success(isRTL ? 'تم مسح المحادثة' : 'Conversation cleared')
  }

  const loadConversation = (prompt: string, response: string) => {
    setPrompt(prompt)
    setResult(response)
    setGeneratedImage(null)
  }

  return (
    <div className="space-y-4 p-4 max-w-3xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <AIHeader
        onClear={handleClear}
        loadConversation={loadConversation}
      />
      
      <AITabs
        prompt={prompt}
        result={result}
        isTyping={isTyping}
        generatedImage={generatedImage}
        isLoadingText={isLoadingText}
        isLoadingImage={isLoadingImage}
        textError={textError}
        imageError={imageError}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        onGenerateImage={handleGenerateImage}
      />
    </div>
  )
}