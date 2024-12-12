import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Flag } from "lucide-react";
import { ClientForm } from "./forms/ClientForm";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AddClientFormProps {
  defaultStatus?: string;
  children?: React.ReactNode;
}

export function AddClientForm({ defaultStatus = "new", children }: AddClientFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const checkDuplicateClient = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, phone')
        .eq('phone', phone);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return false;
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(t('errors.notAuthenticated'));
        return;
      }

      // Check for duplicates by phone number
      const isDuplicate = await checkDuplicateClient(data.phone);
      if (isDuplicate) {
        toast.error(t('clients.duplicateError'));
        return;
      }

      const { error } = await supabase
        .from('clients')
        .insert([{
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          facebook: data.facebook || null,
          country: data.country || "Egypt",
          city: data.city || null,
          project: data.project || null,
          budget: data.budget || null,
          sales_person: data.salesPerson || null,
          contact_method: data.contactMethod || "phone",
          campaign: data.campaign || null,
          status: defaultStatus,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(t('clients.addSuccess'));
      setOpen(false);
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error(t('clients.addError'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200",
              isRTL ? "text-right" : "text-left"
            )}
          >
            <div className="flex items-center gap-3">
              <Flag className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                {t("nav.addNewClient")}
              </span>
            </div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("clients.addNew")}</DialogTitle>
        </DialogHeader>
        <ClientForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}