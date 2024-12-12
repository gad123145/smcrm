import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Message } from "./Message";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/integrations/supabase/types/chat";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

interface ChatMessagesProps {
  isRTL: boolean;
}

export function ChatMessages({ isRTL }: ChatMessagesProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['chat-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          user:user_id(
            full_name,
            avatar
          ),
          reactions:chat_reactions(
            id,
            emoji,
            message_id,
            user_id,
            created_at
          ),
          comments:chat_comments(
            id,
            content,
            user_id,
            created_at,
            updated_at,
            user:user_id(
              full_name,
              avatar
            )
          )
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return data as unknown as ChatMessage[];
    },
  });

  // Subscribe to realtime updates
  useRealtimeSubscription('chat_messages', ['chat-messages']);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="h-full p-4" ref={scrollRef}>
      <div className={cn(
        "space-y-4",
        isRTL ? "space-x-reverse" : ""
      )}>
        {messages?.map((message) => (
          <Message
            key={message.id}
            message={message}
            isRTL={isRTL}
          />
        ))}
      </div>
    </ScrollArea>
  );
}