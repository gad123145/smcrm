import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileUp } from "lucide-react";
import { useState } from "react";
import { FileDropZone } from "./import/FileDropZone";
import { FieldMapping } from "./import/FieldMapping";
import { ImportLogic } from "./import/ImportLogic";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImportClientsSheetProps {
  children?: React.ReactNode;
}

export function ImportClientsSheet({ children }: ImportClientsSheetProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const importLogic = new ImportLogic();
  const queryClient = useQueryClient();

  const handleFileSelect = (selectedFile: File) => {
    console.log('File selected:', selectedFile.name);
    setFile(selectedFile);
  };

  const handleDataMapped = async (mappedData: any[]) => {
    try {
      console.log('Starting import with mapped data:', mappedData);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(t('errors.unauthorized'));
        return;
      }

      const result = await importLogic.importClients(mappedData, user.id);
      console.log('Import result:', result);
      await queryClient.invalidateQueries({ queryKey: ['clients'] });

      if (result.duplicates > 0) {
        // First show duplicates message
        console.log('Showing duplicates message');
        toast.info(t('clients.importClients.duplicatesFound', {
          duplicates: result.duplicates,
          phone: result.duplicatePhones.join(', ')
        }));

        // If all clients were duplicates
        if (result.imported === 0) {
          console.log('All clients were duplicates');
          toast.error(t('clients.importClients.allDuplicates', {
            count: result.duplicates,
            phone: result.duplicatePhones.join(', ')
          }));
        }
      }

      // Show success message if any clients were imported
      if (result.imported > 0) {
        console.log('Showing success message for imported clients');
        toast.success(t('clients.importClients.success', {
          count: result.imported
        }));
      } else if (result.duplicates === 0) {
        // Only show no valid data message if there were no duplicates
        console.log('No valid data to import');
        toast.error(t('clients.importClients.noValidData'));
      }
      
      setOpen(false);
      setFile(null);
    } catch (error: any) {
      console.error('Error importing clients:', error);
      toast.error(error.message || t('errors.importFailed'));
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200",
              isRTL ? "text-right" : "text-left"
            )}
          >
            <div className="flex items-center gap-3">
              <FileUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                {t("clients.importClients.title")}
              </span>
            </div>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{t("clients.importClients.title")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] mt-6 pr-4">
          {!file ? (
            <FileDropZone onFileSelect={handleFileSelect} />
          ) : (
            <FieldMapping file={file} onDataMapped={handleDataMapped} />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}