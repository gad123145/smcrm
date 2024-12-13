import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface UserTableHeaderProps {
  isRTL: boolean;
}

export function UserTableHeader({ isRTL }: UserTableHeaderProps) {
  const { t } = useTranslation();

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <input type="checkbox" className="rounded border-gray-300" />
        </TableHead>
        <TableHead className={cn(isRTL && "text-right")}>
          {isRTL ? "الاسم" : "Name"}
        </TableHead>
        <TableHead className={cn(isRTL && "text-right")}>
          {isRTL ? "البريد الإلكتروني" : "Email"}
        </TableHead>
        <TableHead className={cn(isRTL && "text-right")}>
          {isRTL ? "الدور" : "Role"}
        </TableHead>
        <TableHead className={cn(isRTL && "text-right")}>
          {isRTL ? "الحالة" : "Status"}
        </TableHead>
        <TableHead className={cn(isRTL && "text-right")}>
          {isRTL ? "الإجراءات" : "Actions"}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}