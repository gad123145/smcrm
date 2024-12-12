import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "@/components/users/UserAvatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Comments } from "./Comments";
import { Reactions } from "./Reactions";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import type { ChatMessage } from "@/integrations/supabase/types/chat";

interface MessageProps {
  message: ChatMessage;
  isRTL: boolean;
}

export function Message({ message, isRTL }: MessageProps) {
  const { t } = useTranslation();
  const [showComments, setShowComments] = useState(false);

  const formatDate = (date: string) => {
    return format(new Date(date), "PPp", {
      locale: isRTL ? ar : undefined
    });
  };

  return (
    <div className={cn(
      "flex gap-4",
      isRTL ? "flex-row-reverse" : ""
    )}>
      <UserAvatar
        user={{
          full_name: message.user?.full_name,
          avatar: message.user?.avatar
        }}
      />
      <div className="flex-1 space-y-2">
        <div className={cn(
          "flex items-center gap-2",
          isRTL ? "flex-row-reverse" : ""
        )}>
          <span className="font-medium">{message.user?.full_name}</span>
          <span className="text-sm text-muted-foreground">
            {formatDate(message.created_at)}
          </span>
        </div>

        <div className={cn(
          "rounded-lg bg-muted p-4",
          isRTL ? "text-right" : ""
        )}>
          <p>{message.content}</p>
          {message.image && (
            <img
              src={message.image}
              alt=""
              className="mt-2 rounded-lg max-h-96 object-cover"
            />
          )}
          {message.video && (
            <video
              src={message.video}
              controls
              className="mt-2 rounded-lg max-h-96"
            />
          )}
        </div>

        <div className={cn(
          "flex items-center gap-4",
          isRTL ? "flex-row-reverse" : ""
        )}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            {message.comments?.length || 0}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <SmilePlus className="h-4 w-4" />
          </Button>
        </div>

        <Reactions messageId={message.id} reactions={message.reactions || []} isRTL={isRTL} />
        
        {showComments && (
          <Comments
            messageId={message.id}
            comments={message.comments || []}
            isRTL={isRTL}
          />
        )}
      </div>
    </div>
  );
}