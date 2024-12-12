import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ResponseDisplayProps {
  response: string
  isTyping: boolean
}

export function ResponseDisplay({ response, isTyping }: ResponseDisplayProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response)
      toast.success('تم نسخ النص')
    } catch (err) {
      toast.error('فشل نسخ النص')
    }
  }

  return (
    <div className="relative bg-muted p-4 rounded-lg">
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="hover:bg-primary/10"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="pt-8">
        <h3 className="font-semibold mb-2 text-primary">الإجابة:</h3>
        <p className={cn(
          "whitespace-pre-wrap",
          "prose dark:prose-invert max-w-none",
          "text-sm leading-relaxed",
          isTyping && "animate-pulse"
        )}>{response}</p>
      </div>
    </div>
  )
}