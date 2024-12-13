import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Client } from "@/data/clientsData";
import { ClientDetailsTab } from "./ClientDetailsTab";
import { ClientActionsTab } from "./ClientActionsTab";
import { ClientCommentsTab } from "./ClientCommentsTab";
import { ClientAIAnalysis } from "@/components/ai/ClientAIAnalysis";

interface ClientPreviewDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientPreviewDialog({ client, open, onOpenChange }: ClientPreviewDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const tabNames = {
    details: isRTL ? "التفاصيل" : "Details",
    actions: isRTL ? "الإجراءات" : "Actions",
    comments: isRTL ? "التعليقات" : "Comments",
    analysis: isRTL ? "التحليلات" : "Analysis"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">
              {tabNames.details}
            </TabsTrigger>
            <TabsTrigger value="actions">
              {tabNames.actions}
            </TabsTrigger>
            <TabsTrigger value="comments">
              {tabNames.comments}
            </TabsTrigger>
            <TabsTrigger value="analysis">
              {tabNames.analysis}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <ClientDetailsTab client={client} />
          </TabsContent>
          
          <TabsContent value="actions">
            <ClientActionsTab client={client} />
          </TabsContent>
          
          <TabsContent value="comments">
            <ClientCommentsTab client={client} />
          </TabsContent>

          <TabsContent value="analysis">
            <ClientAIAnalysis client={client} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}