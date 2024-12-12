import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientsUnassignButtonProps {
  selectedCount: number;
  clientIds: string[];
  onSuccess: () => void;
}

export function ClientsUnassignButton({ selectedCount, clientIds, onSuccess }: ClientsUnassignButtonProps) {
  const { t } = useTranslation();

  const handleUnassign = async () => {
    const { error } = await supabase
      .from('clients')
      .update({ assigned_to: null })
      .in('id', clientIds);

    if (error) {
      toast.error(t("clients.unassignError"));
      return;
    }

    toast.success(t("clients.unassignSuccess"));
    onSuccess();
  };

  if (selectedCount === 0) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserMinus className="h-4 w-4" />
          {t("clients.unassignSelected", { count: selectedCount })}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("clients.unassignConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("clients.unassignConfirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnassign}>
            {t("common.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}