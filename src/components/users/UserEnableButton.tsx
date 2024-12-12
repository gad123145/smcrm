import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface UserEnableButtonProps {
  userId: string;
}

export function UserEnableButton({ userId }: UserEnableButtonProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Fetch initial enabled status
  useEffect(() => {
    const fetchEnabledStatus = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_enabled')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setIsEnabled(profile?.is_enabled ?? true);
      } catch (error) {
        console.error('Error fetching enabled status:', error);
      }
    };

    fetchEnabledStatus();
  }, [userId]);

  const handleToggleEnabled = async () => {
    try {
      setIsUpdating(true);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_enabled: !isEnabled })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update local state
      setIsEnabled(!isEnabled);
      toast.success(
        isRTL 
          ? (isEnabled ? "تم تعطيل حساب المستخدم بنجاح" : "تم تفعيل حساب المستخدم بنجاح")
          : (isEnabled ? "User account disabled successfully" : "User account enabled successfully")
      );
    } catch (error: any) {
      console.error('Error updating user enabled status:', error);
      toast.error(
        isRTL 
          ? "حدث خطأ أثناء تحديث حالة المستخدم"
          : "Error updating user status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      onClick={handleToggleEnabled} 
      disabled={isUpdating}
      variant={isEnabled ? "default" : "destructive"}
      size="sm"
      className={cn(
        isRTL && "font-cairo",
        isEnabled && "bg-green-500 hover:bg-green-600",
        !isEnabled && "bg-red-500 hover:bg-red-600",
        "text-white"
      )}
    >
      {isEnabled 
        ? (isRTL ? "مفعل" : "Enabled")
        : (isRTL ? "معطل" : "Disabled")
      }
    </Button>
  );
}