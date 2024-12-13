import { Button } from "@/components/ui/button";
import { ClientsRowsPerPage } from "../ClientsRowsPerPage";
import { ClientsDeleteButton } from "../ClientsDeleteButton";
import { ClientsUnassignButton } from "../ClientsUnassignButton";
import { useTranslation } from "react-i18next";
import { Download, UserPlus2, UserMinus2 } from "lucide-react";
import type { RowsPerPage } from "../ClientsRowsPerPage";
import { cn } from "@/lib/utils";

interface ClientsListHeaderProps {
  rowsPerPage: RowsPerPage;
  onRowsPerPageChange: (value: RowsPerPage) => void;
  selectedClients: string[];
  onExportAll: () => void;
  onExportSelected: () => void;
  onUnassign: () => void;
  onAssign: () => void;
  onDelete: () => Promise<void>;
  userRole: string | null;
}

export function ClientsListHeader({
  rowsPerPage,
  onRowsPerPageChange,
  selectedClients,
  onExportAll,
  onExportSelected,
  onUnassign,
  onAssign,
  onDelete,
  userRole,
}: ClientsListHeaderProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const hasSelectedClients = selectedClients.length > 0;

  return (
    <div className={cn(
      "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
      isRTL && "font-cairo"
    )}>
      <div className="flex items-center gap-2">
        <ClientsRowsPerPage
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {hasSelectedClients ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportSelected}
              className="h-8"
            >
              <Download className="h-4 w-4 mr-2" />
              {t("clients.exportSelected")}
            </Button>

            {(userRole === 'admin' || userRole === 'supervisor') && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUnassign}
                  className="h-8"
                >
                  <UserMinus2 className="h-4 w-4 mr-2" />
                  {t("clients.unassign")}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAssign}
                  className="h-8"
                >
                  <UserPlus2 className="h-4 w-4 mr-2" />
                  {t("clients.assign")}
                </Button>

                <ClientsDeleteButton
                  selectedCount={selectedClients.length}
                  onDelete={onDelete}
                  variant="outline"
                  size="sm"
                />
              </>
            )}
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportAll}
            className="h-8"
          >
            <Download className="h-4 w-4 mr-2" />
            {t("clients.exportAll")}
          </Button>
        )}
      </div>
    </div>
  );
}