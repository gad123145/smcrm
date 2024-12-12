import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

interface ClientsTableHeaderProps {
  onSelectAll: () => void;
  isAllSelected: boolean;
}

export function ClientsTableHeader({ onSelectAll, isAllSelected }: ClientsTableHeaderProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <TableHeader>
      <TableRow className="whitespace-nowrap">
        <TableHead className="w-[50px]">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead className={`min-w-[150px] ${isRTL ? "text-right" : "text-left"}`}>
          {t("clients.name")}
        </TableHead>
        <TableHead className={`min-w-[150px] ${isRTL ? "text-right" : "text-left"}`}>
          {t("clients.phone")}
        </TableHead>
        <TableHead className={`min-w-[200px] ${isRTL ? "text-right" : "text-left"}`}>
          {t("clients.email")}
        </TableHead>
        <TableHead className={`min-w-[100px] ${isRTL ? "text-right" : "text-left"}`}>
          {t("clients.facebook")}
        </TableHead>
        <TableHead className={`min-w-[150px] ${isRTL ? "text-right" : "text-left"}`}>
          {t("clients.country")}
        </TableHead>
        <TableHead className={`min-w-[150px] ${isRTL ? "text-right" : "text-left"}`}>
          {t("clients.city")}
        </TableHead>
        <TableHead className={`min-w-[150px] ${isRTL ? "text-right" : "text-left"}`}>
          {t("clients.project")}
        </TableHead>
        <TableHead className={`min-w-[150px] ${isRTL ? "text-right" : "text-left"}`}>
          {t("table.status")}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}