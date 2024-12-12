import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserFormHeaderProps {
  currentRole: string | null;
  isRTL: boolean;
}

export function UserFormHeader({ currentRole, isRTL }: UserFormHeaderProps) {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription className={cn(isRTL && "font-cairo")}>
        {isRTL ? 'دورك الحالي:' : 'Your current role:'} {currentRole || 'loading...'}
      </AlertDescription>
    </Alert>
  );
}