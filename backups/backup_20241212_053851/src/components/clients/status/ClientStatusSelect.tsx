import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClientStatusSelectProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export function ClientStatusSelect({ status, onStatusChange }: ClientStatusSelectProps) {
  const { t } = useTranslation();

  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          {t(`clients.status.${status}`)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">{t("clients.status.new")}</SelectItem>
        <SelectItem value="potential">{t("clients.status.potential")}</SelectItem>
        <SelectItem value="interested">{t("clients.status.interested")}</SelectItem>
        <SelectItem value="responded">{t("clients.status.responded")}</SelectItem>
        <SelectItem value="noResponse">{t("clients.status.noResponse")}</SelectItem>
        <SelectItem value="scheduled">{t("clients.status.scheduled")}</SelectItem>
        <SelectItem value="postMeeting">{t("clients.status.postMeeting")}</SelectItem>
        <SelectItem value="whatsappContact">{t("clients.status.whatsappContact")}</SelectItem>
        <SelectItem value="facebookContact">{t("clients.status.facebookContact")}</SelectItem>
        <SelectItem value="booked">{t("clients.status.booked")}</SelectItem>
        <SelectItem value="cancelled">{t("clients.status.cancelled")}</SelectItem>
        <SelectItem value="sold">{t("clients.status.sold")}</SelectItem>
        <SelectItem value="postponed">{t("clients.status.postponed")}</SelectItem>
        <SelectItem value="resale">{t("clients.status.resale")}</SelectItem>
      </SelectContent>
    </Select>
  );
}