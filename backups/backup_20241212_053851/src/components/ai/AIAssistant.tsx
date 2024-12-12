import { useState, useEffect } from 'react'
import { useGeminiAI } from '@/hooks/useGeminiAI'
import { useImageGeneration } from '@/hooks/useImageGeneration'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Trash2, Send, History, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from '@/integrations/supabase/client'
import { ConversationHistory } from './ConversationHistory'
import { ResponseDisplay } from './ResponseDisplay'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AIAssistant() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [conversations, setConversations] = useState<Array<{
    id: string;
    prompt: string;
    response: string;
    created_at: string;
  }>>([])
  
  const { generateText, isLoading: isLoadingText, error: textError } = useGeminiAI()
  const { generateImage, isLoading: isLoadingImage, error: imageError } = useImageGeneration()

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setConversations(data || [])
    } catch (err) {
      toast.error('فشل في تحميل المحادثات السابقة')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast.error('الرجاء إدخال نص للسؤال')
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
      toast.success('تم توليد النص بنجاح')
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.id) {
          toast.error('يجب تسجيل الدخول لحفظ المحادثة')
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
        fetchConversations()
      } catch (err) {
        toast.error('فشل في حفظ المحادثة')
      }
    }
  }

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('الرجاء إدخال وصف للصورة')
      return
    }

    const image = await generateImage(prompt)
    if (image) {
      setGeneratedImage(image)
      toast.success('تم توليد الصورة بنجاح')
    }
  }

  const handleClear = () => {
    setPrompt('')
    setResult('')
    setGeneratedImage(null)
    toast.success('تم مسح المحادثة')
  }

  const loadConversation = (prompt: string, response: string) => {
    setPrompt(prompt)
    setResult(response)
    setGeneratedImage(null)
  }

  return (
    <div className="space-y-4 p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">المساعد الذكي</h2>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                size="icon"
                className="hover:bg-primary/10"
              >
                <History className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <ConversationHistory 
              conversations={conversations}
              onSelect={loadConversation}
            />
          </Dialog>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClear}
            className="hover:bg-destructive/10"
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">نص</TabsTrigger>
          <TabsTrigger value="image">صورة</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                className="min-h-[100px] pr-12 resize-none"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={isLoadingText || !prompt.trim()}
                className="absolute bottom-2 right-2"
              >
                {isLoadingText ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>

          {textError && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
              {textError}
            </div>
          )}

          {result && (
            <ResponseDisplay response={result} isTyping={isTyping} />
          )}
        </TabsContent>

        <TabsContent value="image">
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="اكتب وصف الصورة هنا..."
                className="min-h-[100px] pr-12 resize-none"
              />
              <Button 
                onClick={handleGenerateImage}
                size="icon"
                disabled={isLoadingImage || !prompt.trim()}
                className="absolute bottom-2 right-2"
              >
                {isLoadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
              </Button>
            </div>

            {imageError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
                {imageError}
              </div>
            )}

            {generatedImage && (
              <div className="relative bg-muted p-4 rounded-lg">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
