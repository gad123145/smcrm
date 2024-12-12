import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { KeyRound } from "lucide-react";

interface UserCredentialsFormProps {
  user: {
    id: string;
    email: string | null;
  };
  onEmailUpdate: (email: string) => void;
}

export function UserCredentialsForm({ user, onEmailUpdate }: UserCredentialsFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [email, setEmail] = useState(user.email || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      );

      if (error) throw error;
      
      toast.success(isRTL ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" : "Password reset link has been sent to your email");
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(isRTL ? "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور" : "Error sending password reset link");
    }
  };

  const handleEmailUpdate = async () => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase.auth.updateUser({ 
        email: email 
      });

      if (error) throw error;

      onEmailUpdate(email);
      toast.success(isRTL ? "تم تحديث البريد الإلكتروني بنجاح" : "Email updated successfully");
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث البريد الإلكتروني" : "Error updating email");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email" className={cn(isRTL && "font-cairo text-right")}>
          {isRTL ? "البريد الإلكتروني" : "Email"}
        </Label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isUpdating}
            className={cn(isRTL && "text-right")}
            dir="ltr"
          />
          <Button 
            onClick={handleEmailUpdate}
            disabled={isUpdating || email === user.email}
            className={cn(isRTL && "font-cairo")}
          >
            {isRTL ? "تحديث" : "Update"}
          </Button>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="sm"
        onClick={handlePasswordReset}
        className={cn(isRTL && "font-cairo")}
      >
        <KeyRound className="h-4 w-4 mr-2" />
        {isRTL ? "إعادة تعيين كلمة المرور" : "Reset Password"}
      </Button>
    </div>
  );
}