import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { PermissionsList } from "./PermissionsList";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialPermissions: string[];
}

export function PermissionsDialog({
  open,
  onOpenChange,
  userId,
  initialPermissions
}: PermissionsDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissions);
  const [isSaving, setIsSaving] = useState(false);

  // Enable realtime subscription
  useRealtimeSubscription('user_permissions', ['permissions', userId]);

  // Fetch existing permissions
  const { data: existingPermissions } = useQuery({
    queryKey: ['permissions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('permission_key')
        .eq('user_id', userId);

      if (error) throw error;
      return data.map(p => p.permission_key);
    },
    enabled: open,
  });

  // Update selected permissions when existing permissions are fetched
  useEffect(() => {
    if (existingPermissions) {
      setSelectedPermissions(existingPermissions);
    }
  }, [existingPermissions]);

  // Check if current user is admin
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
    },
  });

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(current => 
      current.includes(permission)
        ? current.filter(p => p !== permission)
        : [...current, permission]
    );
  };

  const handleSave = async () => {
    if (currentUserRole !== 'admin') {
      toast.error(isRTL ? "غير مصرح لك بإدارة الصلاحيات" : "You are not authorized to manage permissions");
      return;
    }

    try {
      setIsSaving(true);

      // Delete existing permissions
      const { error: deleteError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Insert new permissions
      if (selectedPermissions.length > 0) {
        const { error: insertError } = await supabase
          .from('user_permissions')
          .insert(
            selectedPermissions.map(permission => ({
              user_id: userId,
              permission_key: permission
            }))
          );

        if (insertError) throw insertError;
      }

      toast.success(isRTL ? "تم حفظ الصلاحيات بنجاح" : "Permissions saved successfully");
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حفظ الصلاحيات" : "Error saving permissions");
    } finally {
      setIsSaving(false);
    }
  };

  // If user is not admin, don't show the dialog
  if (currentUserRole !== 'admin') {
    if (open) {
      toast.error(isRTL ? "غير مصرح لك بإدارة الصلاحيات" : "You are not authorized to manage permissions");
      onOpenChange(false);
    }
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className={cn(isRTL && "font-cairo text-right")}>
            {t('users.permissions.title')}
          </DialogTitle>
        </DialogHeader>

        <PermissionsList
          selectedPermissions={selectedPermissions}
          onPermissionToggle={handlePermissionToggle}
          isRTL={isRTL}
        />

        <div className={cn(
          "flex justify-end gap-2 mt-6",
          isRTL && "flex-row-reverse"
        )}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={cn(isRTL && "font-cairo")}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(isRTL && "font-cairo")}
          >
            {isSaving ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? "حفظ" : "Save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}