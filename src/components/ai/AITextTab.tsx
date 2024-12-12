import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { ResponseDisplay } from './ResponseDisplay';

interface AITextTabProps {
  prompt: string;
  result: string;
  isTyping: boolean;
  isLoading: boolean;
  error?: string;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function AITextTab({
  prompt,
  result,
  isTyping,
  isLoading,
  error,
  onPromptChange,
  onSubmit
}: AITextTabProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={isRTL ? "اكتب سؤالك هنا..." : "Type your question here..."}
            className="min-h-[100px] pr-12 resize-none"
            dir={isRTL ? "rtl" : "ltr"}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !prompt.trim()}
            className="absolute bottom-2 right-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {result && (
        <ResponseDisplay response={result} isTyping={isTyping} />
      )}
    </div>
  );
}