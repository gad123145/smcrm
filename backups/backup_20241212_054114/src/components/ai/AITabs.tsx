import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AITextTab } from "./AITextTab";
import { AIImageTab } from "./AIImageTab";
import { cn } from "@/lib/utils";

interface AITabsProps {
  prompt: string;
  result: string;
  isTyping: boolean;
  generatedImage: string | null;
  isLoadingText: boolean;
  isLoadingImage: boolean;
  textError?: string;
  imageError?: string;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onGenerateImage: () => Promise<void>;
}

export function AITabs({
  prompt,
  result,
  isTyping,
  generatedImage,
  isLoadingText,
  isLoadingImage,
  textError,
  imageError,
  onPromptChange,
  onSubmit,
  onGenerateImage
}: AITabsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Tabs defaultValue="text" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="text">{isRTL ? "نص" : "Text"}</TabsTrigger>
        <TabsTrigger value="image">{isRTL ? "صورة" : "Image"}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="text">
        <AITextTab
          prompt={prompt}
          result={result}
          isTyping={isTyping}
          isLoading={isLoadingText}
          error={textError}
          onPromptChange={onPromptChange}
          onSubmit={onSubmit}
        />
      </TabsContent>

      <TabsContent value="image">
        <AIImageTab
          prompt={prompt}
          generatedImage={generatedImage}
          isLoading={isLoadingImage}
          error={imageError}
          onPromptChange={onPromptChange}
          onGenerateImage={onGenerateImage}
        />
      </TabsContent>
    </Tabs>
  );
}