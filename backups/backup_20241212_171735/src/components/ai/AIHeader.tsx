import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { History, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ConversationHistory } from './ConversationHistory';
import { cn } from "@/lib/utils";

interface AIHeaderProps {
  onClear: () => void;
  loadConversation: (prompt: string, response: string) => void;
}

export function AIHeader({ onClear, loadConversation }: AIHeaderProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className={cn(
        "text-2xl font-bold text-primary",
        isRTL && "font-cairo"
      )}>
        {isRTL ? "المساعد الذكي" : "AI Assistant"}
      </h2>
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
            conversations={[]}
            onSelect={loadConversation}
          />
        </Dialog>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClear}
          className="hover:bg-destructive/10"
        >
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}