import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

type UserCredentialsProps = {
  email: string;
};

export function UserCredentials({ email }: UserCredentialsProps) {
  const { t } = useTranslation();
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handlePasswordReset = async () => {
    try {
      if (!email || !email.trim()) {
        toast.error("البريد الإلكتروني مطلوب | Email is required");
        return;
      }

      setIsResettingPassword(true);
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      );

      if (resetError) throw resetError;

      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني | Password reset link has been sent to your email");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="email">البريد الإلكتروني | Email Address</Label>
      <Input
        id="email"
        type="email"
        value={email}
        readOnly
      />
      <Button 
        variant="outline" 
        size="sm"
        onClick={handlePasswordReset}
        disabled={isResettingPassword || !email}
        className="mt-2"
      >
        <KeyRound className="h-4 w-4 mr-2" />
        إعادة تعيين كلمة المرور | Reset Password
      </Button>
    </div>
  );
}