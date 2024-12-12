import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface UserFormActionsProps {
  onSave: () => void;
  isUpdating: boolean;
  isRTL: boolean;
}

export function UserFormActions({ onSave, isUpdating, isRTL }: UserFormActionsProps) {
  const { t } = useTranslation();

  return (
    <div className={cn(
      "flex gap-4 mt-6",
      isRTL ? "flex-row-reverse" : "flex-row"
    )}>
      <Button
        onClick={onSave}
        disabled={isUpdating}
        className={cn(isRTL && "font-cairo")}
      >
        {isUpdating ? t('users.form.saving') : t('users.form.save')}
      </Button>
    </div>
  );
}