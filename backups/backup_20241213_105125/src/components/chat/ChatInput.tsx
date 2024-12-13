import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatInputProps {
  isRTL: boolean;
}

export function ChatInput({ isRTL }: ChatInputProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (data: { content: string; image?: string; video?: string }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          ...data,
          user_id: session.session.user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      toast.success(isRTL ? "تم إرسال الرسالة" : "Message sent");
    },
    onError: () => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred");
    }
  });

  const handleFileUpload = async (file: File, type: 'image' | 'video') => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat')
        .getPublicUrl(filePath);

      sendMessage({
        content: message,
        [type]: publicUrl
      });
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء رفع الملف" : "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border-t">
      <div className={cn(
        "flex items-end gap-2",
        isRTL ? "flex-row-reverse" : ""
      )}>
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isRTL ? "اكتب رسالة..." : "Type a message..."}
            className={cn(
              "min-h-[80px]",
              isRTL ? "text-right" : ""
            )}
          />
        </div>
        <div className={cn(
          "flex items-center gap-2",
          isRTL ? "flex-row-reverse" : ""
        )}>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'image');
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={uploading || isPending}
          >
            <Image className="h-4 w-4" />
          </Button>

          <input
            type="file"
            id="video-upload"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'video');
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => document.getElementById('video-upload')?.click()}
            disabled={uploading || isPending}
          >
            <Video className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => {
              if (message.trim()) {
                sendMessage({ content: message });
              }
            }}
            disabled={!message.trim() || isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}