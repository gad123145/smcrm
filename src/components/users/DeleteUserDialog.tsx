import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  onDelete: () => void;
  deleteText: string | React.ReactNode;
}

export function DeleteUserDialog({ userId, userName, onDelete, deleteText }: DeleteUserDialogProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId },
      });

      if (error) throw error;
      
      toast.success(isRTL ? "تم حذف المستخدم بنجاح" : "User deleted successfully");
      onDelete();
      setOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف المستخدم" : "Error deleting user");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className={cn(
          "hover:bg-destructive/10",
          isRTL && "font-cairo"
        )}
      >
        {deleteText}
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn(isRTL && "font-cairo text-right")}>
            {isRTL ? "هل أنت متأكد؟" : "Are you sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription className={cn(isRTL && "font-cairo text-right")}>
            {isRTL 
              ? `سيتم حذف المستخدم "${userName}" وجميع البيانات المرتبطة به بشكل دائم.`
              : `This will permanently delete the user "${userName}" and all associated data.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={cn(isRTL && "font-cairo")}>
            {isRTL ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className={cn("bg-destructive hover:bg-destructive/90", isRTL && "font-cairo")}
          >
            {isRTL ? "حذف" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}