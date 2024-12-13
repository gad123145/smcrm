import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon } from "lucide-react";

interface AIImageTabProps {
  prompt: string;
  generatedImage: string | null;
  isLoading: boolean;
  error?: string;
  onPromptChange: (value: string) => void;
  onGenerateImage: () => Promise<void>;
}

export function AIImageTab({
  prompt,
  generatedImage,
  isLoading,
  error,
  onPromptChange,
  onGenerateImage
}: AIImageTabProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={isRTL ? "اكتب وصف الصورة هنا..." : "Describe the image you want to generate..."}
          className="min-h-[100px] pr-12 resize-none"
          dir={isRTL ? "rtl" : "ltr"}
        />
        <Button 
          onClick={onGenerateImage}
          size="icon"
          disabled={isLoading || !prompt.trim()}
          className="absolute bottom-2 right-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="relative bg-muted p-4 rounded-lg">
          <img 
            src={generatedImage} 
            alt={isRTL ? "الصورة المولدة" : "Generated image"}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
}