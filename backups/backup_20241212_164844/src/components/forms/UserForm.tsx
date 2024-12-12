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
      <UserFormHeader currentRole={currentUserRole} isRTL={isRTL} />

      {user && (
        <UserAvatarUpload 
          user={{ ...user, avatar }} 
          onAvatarUpdate={setAvatar} 
        />
      )}

      <UserFormFields
        fullName={fullName}
        email={email}
        isUpdating={isUpdating}
        onFullNameChange={setFullName}
        onEmailChange={setEmail}
        isRTL={isRTL}
      />

      {user && (
        <UserCredentialsForm 
          user={{ ...user, email }} 
          onEmailUpdate={setEmail}
        />
      )}
      
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

      <Button
        variant="outline"
        onClick={() => setPermissionsOpen(true)}
        className={cn(isRTL && "font-cairo")}
      >
        {isRTL ? 'إدارة الصلاحيات' : 'Manage Permissions'}
      </Button>

      <UserFormActions
        onSave={handleUpdateUser}
        isUpdating={isUpdating}
        isRTL={isRTL}
      />

      {user && (
        <PermissionsDialog
          open={permissionsOpen}
          onOpenChange={setPermissionsOpen}
          userId={user.id}
          initialPermissions={[]}
        />
      )}
    </div>
  );
}