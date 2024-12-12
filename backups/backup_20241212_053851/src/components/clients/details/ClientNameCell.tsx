import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { Client } from "@/data/clientsData";
import { ClientAssignmentInfo } from "../ClientAssignmentInfo";
import { ClientPreviewDialog } from "../ClientPreviewDialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useClientStore } from "@/data/clientsData";
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

interface ClientNameCellProps {
  client: Client;
}

export function ClientNameCell({ client }: ClientNameCellProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const removeClients = useClientStore(state => state.removeClients);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log('Starting delete operation for client:', client.id);
      
      // First delete from Supabase
      console.log('Sending delete request to Supabase...');
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id);

      if (error) {
        console.error('Supabase deletion error:', error);
        throw error;
      }

      console.log('Successfully deleted from Supabase');
      
      // Then update local state
      console.log('Updating local state...');
      removeClients([client.id]);
      console.log('Local state updated successfully');
      
      toast.success(t('clients.deleteSuccess'));
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (err) {
      console.error('Error in handleDelete:', err);
      toast.error(t('errors.deleteClients'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TableCell>
      <div className="space-y-1">
        <div className="group relative flex items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className={cn(
              "font-medium hover:underline block",
              isRTL ? "text-right" : "text-left"
            )}
          >
            {client.name}
          </button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 absolute right-0"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('clients.deleteConfirmTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('clients.deleteConfirmDescription')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {t('common.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <ClientAssignmentInfo
          assignedTo={client.assignedTo}
          userId={client.userId}
          clientId={client.id}
        />
      </div>
      
      <ClientPreviewDialog
        client={client}
        onOpenChange={setIsPreviewOpen}
        open={isPreviewOpen}
      />
    </TableCell>
  );
}
