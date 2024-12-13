import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatarUpload } from "./UserAvatarUpload";
import { UserCredentialsForm } from "./UserCredentialsForm";
import { UserRoleStatus } from "../users/UserRoleStatus";
import { PermissionsDialog } from "../users/permissions/PermissionsDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { UserFormHeader } from "../users/forms/UserFormHeader";
import { UserFormActions } from "../users/forms/UserFormActions";
import { UserFormFields } from "../users/forms/UserFormFields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserFormProps {
  user?: {
    id: string;
    full_name: string | null;
    role: string | null;
    status: string | null;
    avatar: string | null;
    email?: string | null;
  };
  onUpdate?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function UserForm({ user, onUpdate, onSuccess, onCancel, onClose }: UserFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [role, setRole] = useState(user?.role || "employee");
  const [status, setStatus] = useState(user?.status || "active");
  const [avatar, setAvatar] = useState(user?.avatar);
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: currentUserRole } = useQuery({
    queryKey: ["currentUserRole"],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id);

        if (error) throw error;
        return profiles?.[0]?.role || null;
      } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
    },
    retry: 1
  });

  const isAdmin = currentUserRole === 'admin';
  const isCreating = !user?.id;

  const handleCreateUser = async () => {
    try {
      setIsUpdating(true);

      if (!email || !password) {
        toast.error(isRTL ? "البريد الإلكتروني وكلمة المرور مطلوبة" : "Email and password are required");
        return;
      }

      // Create the user in Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error(isRTL ? "فشل إنشاء المستخدم" : "Failed to create user");
      }

      // Create the user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          role: isAdmin ? role : "employee",
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;

      toast.success(isRTL ? "تم إنشاء المستخدم بنجاح" : "User created successfully");
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(isRTL ? "حدث خطأ أثناء إنشاء المستخدم" : "Error creating user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setIsUpdating(true);
      
      const updateData: any = {
        full_name: fullName,
        status,
        updated_at: new Date().toISOString(),
      };

      if (isAdmin) {
        updateData.role = role;
      }

      if (user?.id) {
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", user.id);

        if (profileUpdateError) throw profileUpdateError;

        toast.success(isRTL ? "تم تحديث بيانات المستخدم بنجاح" : "User updated successfully");
        onUpdate?.();
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث بيانات المستخدم" : "Error updating user");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isCreating && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className={cn(isRTL && "font-cairo")}>
            {isRTL ? 'دورك الحالي:' : 'Your current role:'} {role}
          </AlertDescription>
        </Alert>
      )}

      {!isCreating && (
        <UserAvatarUpload 
          user={{ ...user!, avatar }} 
          onAvatarUpdate={setAvatar} 
        />
      )}

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className={cn(isRTL && "font-cairo text-right")}>
            {isRTL ? "الاسم الكامل" : "Full Name"}
          </Label>
          <Input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isUpdating}
            className={cn(isRTL && "font-cairo text-right")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className={cn(isRTL && "font-cairo text-right")}>
            {isRTL ? "البريد الإلكتروني" : "Email"}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isUpdating || !isCreating}
            className={cn(isRTL && "text-right")}
            dir="ltr"
          />
        </div>

        {isCreating && (
          <div className="grid gap-2">
            <Label htmlFor="password" className={cn(isRTL && "font-cairo text-right")}>
              {isRTL ? "كلمة المرور" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isUpdating}
              className={cn(isRTL && "text-right")}
              dir="ltr"
            />
          </div>
        )}
      </div>
      
      <UserRoleStatus
        role={role}
        status={status}
        onRoleChange={setRole}
        onStatusChange={setStatus}
        disabled={isUpdating || !isAdmin}
      />

      {!isAdmin && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className={cn(isRTL && "font-cairo")}>
            {isRTL ? 'فقط مدير النظام يمكنه تغيير الأدوار' : 'Only administrators can change roles'}
          </AlertDescription>
        </Alert>
      )}

      {!isCreating && (
        <Button
          variant="outline"
          onClick={() => setPermissionsOpen(true)}
          className={cn(isRTL && "font-cairo")}
        >
          {isRTL ? 'إدارة الصلاحيات' : 'Manage Permissions'}
        </Button>
      )}

      <div className={cn(
        "flex justify-end gap-2",
        isRTL && "flex-row-reverse"
      )}>
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isUpdating}
            className={cn(isRTL && "font-cairo")}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
        )}
        <Button 
          onClick={isCreating ? handleCreateUser : handleUpdateUser}
          disabled={isUpdating}
          className={cn(isRTL && "font-cairo")}
        >
          {isCreating ? (isRTL ? "إنشاء" : "Create") : (isRTL ? "حفظ" : "Save")}
        </Button>
      </div>

      {!isCreating && (
        <PermissionsDialog
          open={permissionsOpen}
          onOpenChange={setPermissionsOpen}
          userId={user!.id}
          initialPermissions={[]}
        />
      )}
    </div>
  );
}