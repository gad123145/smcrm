import { useCallback } from 'react';
import { ClientsDeleteButton } from '../ClientsDeleteButton';
import { useClientDeletion } from '@/hooks/useClientDeletion';
import { Button } from '@/components/ui/button';
import { Download, UserPlus2, UserMinus2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ClientsListActionsProps {
  selectedClients: string[];
  onUnassign: () => void;
  onAssign: () => void;
  onExportSelected: () => void;
  onExportAll: () => void;
  userRole: string | null;
}

export function ClientsListActions({
  selectedClients,
  onUnassign,
  onAssign,
  onExportSelected,
  onExportAll,
  userRole
}: ClientsListActionsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { deleteClients } = useClientDeletion();
  
  const handleDelete = useCallback(async () => {
    console.log('Delete button clicked with selected clients:', selectedClients);
    await deleteClients(selectedClients);
  }, [deleteClients, selectedClients]);

  const hasSelectedClients = selectedClients.length > 0;

  return (
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
                onDelete={handleDelete}
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
  );
}