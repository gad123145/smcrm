import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function MappingHeader() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-2">
      <h3 className={cn(
        "text-lg font-semibold",
        isRTL && "text-right"
      )}>
        {t('clients.importClients.mapping.title')}
      </h3>
      <p className={cn(
        "text-sm text-gray-500",
        isRTL && "text-right"
      )}>
        {t('clients.importClients.mapping.description')}
      </p>
    </div>
  );
}