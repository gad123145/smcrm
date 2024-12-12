import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "../users/UserAvatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface UserAvatarUploadProps {
  user: {
    id: string;
    full_name: string | null;
    avatar: string | null;
  };
  onAvatarUpdate: (avatarUrl: string) => void;
}

export function UserAvatarUpload({ user, onAvatarUpdate }: UserAvatarUploadProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onAvatarUpdate(publicUrl);
      toast.success(isRTL ? "تم تحديث الصورة الشخصية بنجاح" : "Avatar updated successfully");
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث الصورة الشخصية" : "Error updating avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <UserAvatar user={user} className="h-24 w-24" />
      <Label htmlFor="avatar" className="cursor-pointer">
        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Upload className="h-4 w-4" />
          {isRTL ? "تغيير الصورة الشخصية" : "Change Avatar"}
        </div>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
          disabled={uploading}
        />
      </Label>
    </div>
  );
}