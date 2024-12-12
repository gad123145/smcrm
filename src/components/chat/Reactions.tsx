import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SmilePlus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ChatReaction } from "@/integrations/supabase/types/chat";

interface ReactionsProps {
  messageId: string;
  reactions: ChatReaction[];
  isRTL: boolean;
}

export function Reactions({ messageId, reactions, isRTL }: ReactionsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: addReaction } = useMutation({
    mutationFn: async ({ emoji }: { emoji: string }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('chat_reactions')
        .insert({
          message_id: messageId,
          emoji,
          user_id: session.session.user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      toast.success(isRTL ? "تم إضافة التفاعل" : "Reaction added");
    },
    onError: () => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred");
    }
  });

  const emojis = [
    "👍", "❤️", "😂", "😮", "😢", "😡",
    "🎉", "👏", "🙏", "🔥", "✨", "🌟",
    "💯", "💪", "🤝", "👌", "💖", "💕",
    "🥰", "😍", "🤔", "🤗", "😊", "😇",
    "🌹", "💐", "🎈", "🎨", "🎭", "🎪"
  ];

  return (
    <div className={cn(
      "flex flex-wrap gap-2",
      isRTL ? "flex-row-reverse" : ""
    )}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <SmilePlus className="h-4 w-4" />
            {isRTL ? "إضافة تفاعل" : "Add reaction"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-[320px] p-2">
          <div className="grid grid-cols-6 gap-2">
            {emojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => addReaction({ emoji })}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {emojis.map((emoji) => {
        const count = reactions?.filter(r => r.emoji === emoji).length || 0;
        if (count > 0) {
          return (
            <Button
              key={emoji}
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => addReaction({ emoji })}
            >
              {emoji} {count}
            </Button>
          );
        }
        return null;
      })}
    </div>
  );
}