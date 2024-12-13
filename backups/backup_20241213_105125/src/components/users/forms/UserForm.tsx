import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatarUpload } from "./UserAvatarUpload";
import { UserCredentialsForm } from "./UserCredentialsForm";
import { UserRoleStatus } from "../UserRoleStatus";
import { PermissionsDialog } from "../permissions/PermissionsDialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";

interface UserFormProps {
  user: {
    id: string;
    full_name: string | null;
    role: string | null;
    status: string | null;
    avatar: string | null;
    email?: string | null;
  };
  onUpdate: () => void;
}

export function UserForm({ user, onUpdate }: UserFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [fullName, setFullName] = useState(user.full_name || "");
  const [role, setRole] = useState(user.role || "employee");
  const [status, setStatus] = useState(user.status || "active");
  const [avatar, setAvatar] = useState(user.avatar);
  const [email, setEmail] = useState(user.email || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch current user's role
  const { data: currentUserRole } = useQuery({
    queryKey: ["currentUserRole"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      return profile?.role;
    }
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

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (profileUpdateError) throw profileUpdateError;

      toast.success(isRTL ? "تم تحديث بيانات المستخدم بنجاح" : "User updated successfully");
      onUpdate();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث بيانات المستخدم" : "Error updating user");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription className={cn(isRTL && "font-cairo")}>
          {isRTL ? 'دورك الحالي:' : 'Your current role:'} {role}
        </AlertDescription>
      </Alert>

      <UserAvatarUpload 
        user={{ ...user, avatar }} 
        onAvatarUpdate={setAvatar} 
      />

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

      <UserCredentialsForm 
        user={{ ...user, email }} 
        onEmailUpdate={setEmail}
      />
      
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

      <div className={cn(
        "flex justify-end gap-2",
        isRTL && "flex-row-reverse"
      )}>
        <Button 
          onClick={handleUpdateUser} 
          disabled={isUpdating}
          className={cn(isRTL && "font-cairo")}
        >
          {isRTL ? "حفظ" : "Save"}
        </Button>
      </div>

      <PermissionsDialog
        open={permissionsOpen}
        onOpenChange={setPermissionsOpen}
        userId={user.id}
        initialPermissions={[]}
      />
    </div>
  );
}