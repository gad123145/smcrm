import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { UserForm } from "./forms/UserForm";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditUserDialogProps {
  user: {
    id: string;
    full_name: string | null;
    role: string | null;
    status: string | null;
    avatar: string | null;
    email?: string | null;
  };
  onUpdate: () => void;
  editText: string | React.ReactNode;
}

export function EditUserDialog({ user, onUpdate, editText }: EditUserDialogProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className={cn(
          "hover:bg-primary/10",
          isRTL && "font-cairo"
        )}
      >
        {editText}
      </Button>

      <DialogContent className="max-w-[600px] max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className={cn(isRTL && "font-cairo text-right")}>
            {isRTL ? "تعديل بيانات المستخدم" : "Edit User Details"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6 h-[calc(85vh-100px)]">
          <UserForm 
            user={user}
            onUpdate={() => {
              onUpdate();
              setOpen(false);
            }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}