import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "@/components/users/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ChatComment } from "@/integrations/supabase/types/chat";

interface CommentsProps {
  messageId: string;
  comments: ChatComment[];
  isRTL: boolean;
}

export function Comments({ messageId, comments, isRTL }: CommentsProps) {
  const { t } = useTranslation();
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('chat_comments')
        .insert({
          message_id: messageId,
          content: comment,
          user_id: session.session.user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      toast.success(isRTL ? "تم إضافة التعليق" : "Comment added");
    },
    onError: () => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred");
    }
  });

  const formatDate = (date: string) => {
    return format(new Date(date), "PPp", {
      locale: isRTL ? ar : undefined
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div
            key={comment.id}
            className={cn(
              "flex gap-2",
              isRTL ? "flex-row-reverse" : ""
            )}
          >
            <UserAvatar
              user={{
                full_name: comment.user?.full_name,
                avatar: comment.user?.avatar
              }}
              className="h-8 w-8"
            />
            <div className="flex-1">
              <div className={cn(
                "flex items-center gap-2",
                isRTL ? "flex-row-reverse" : ""
              )}>
                <span className="font-medium text-sm">
                  {comment.user?.full_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className={cn(
                "text-sm mt-1",
                isRTL ? "text-right" : ""
              )}>
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (comment.trim()) {
            addComment();
          }
        }}
        className={cn(
          "flex items-center gap-2",
          isRTL ? "flex-row-reverse" : ""
        )}
      >
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isRTL ? "اكتب تعليقاً..." : "Write a comment..."}
          className={isRTL ? "text-right" : ""}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!comment.trim() || isPending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}