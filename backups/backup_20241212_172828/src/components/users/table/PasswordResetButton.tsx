import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PasswordResetButtonProps {
  email: string | null;
  isRTL: boolean;
}

export function PasswordResetButton({ email, isRTL }: PasswordResetButtonProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordReset = async () => {
    try {
      if (!email || !email.trim()) {
        toast.error(isRTL 
          ? "لا يوجد بريد إلكتروني مرتبط بهذا المستخدم"
          : "No email associated with this user"
        );
        return;
      }

      if (password !== confirmPassword) {
        toast.error(isRTL 
          ? "كلمات المرور غير متطابقة"
          : "Passwords do not match"
        );
        return;
      }

      if (password.length < 6) {
        toast.error(isRTL 
          ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
          : "Password must be at least 6 characters"
        );
        return;
      }

      setIsResetting(true);
      
      const { data: { user }, error } = await supabase.auth.admin.updateUserById(
        email,
        { password: password }
      );

      if (error) throw error;

      toast.success(isRTL 
        ? "تم تغيير كلمة المرور بنجاح"
        : "Password changed successfully"
      );
      setIsOpen(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(isRTL 
        ? "حدث خطأ أثناء تغيير كلمة المرور"
        : "Error changing password"
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={cn(
          "h-8 w-8",
          isResetting && "opacity-50 cursor-not-allowed"
        )}
      >
        <Key className={cn(
          "h-4 w-4",
          isResetting ? "text-gray-400" : "text-gray-500"
        )} />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className={cn(isRTL && "text-right font-cairo")}>
              {isRTL ? "تغيير كلمة المرور" : "Change Password"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password" className={cn(isRTL && "text-right font-cairo")}>
                {isRTL ? "كلمة المرور الجديدة" : "New Password"}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(isRTL && "text-right")}
                dir="ltr"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className={cn(isRTL && "text-right font-cairo")}>
                {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={cn(isRTL && "text-right")}
                dir="ltr"
              />
            </div>
            <Button 
              onClick={handlePasswordReset}
              disabled={isResetting || !password || !confirmPassword}
              className={cn(isRTL && "font-cairo")}
            >
              {isRTL ? "تغيير كلمة المرور" : "Change Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}