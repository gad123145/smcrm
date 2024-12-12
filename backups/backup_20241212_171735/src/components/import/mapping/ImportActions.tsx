import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ImportActionsProps {
  onImport: () => Promise<void>;
  isValid: boolean;
  loading: boolean;
}

export function ImportActions({ onImport, isValid, loading }: ImportActionsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleImportClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await onImport();
    } catch (error) {
      console.error('Error during import:', error);
    }
  };

  return (
    <div className={cn(
      "flex gap-4 mt-6 border-t pt-4",
      isRTL ? "flex-row-reverse" : "flex-row"
    )}>
      <Button
        onClick={handleImportClick}
        disabled={loading}
        type="submit"
        className={cn(
          "min-w-[120px]",
          "transition-all duration-200",
          "hover:bg-primary/90",
          "focus:ring-2 focus:ring-primary/20",
          "active:transform active:scale-95",
          loading && "cursor-not-allowed opacity-50"
        )}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t('common.loading')}</span>
          </div>
        ) : (
          t('clients.importClients.mapping.import')
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        disabled={loading}
        type="button"
        className={cn(
          "min-w-[120px]",
          "hover:bg-secondary/80",
          "focus:ring-2 focus:ring-secondary/20",
          "active:transform active:scale-95",
          loading && "cursor-not-allowed opacity-50"
        )}
      >
        {t('clients.importClients.mapping.cancel')}
      </Button>
    </div>
  );
}