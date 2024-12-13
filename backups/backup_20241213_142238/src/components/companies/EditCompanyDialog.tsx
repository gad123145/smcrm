import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/forms/CompanyForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/types";

interface EditCompanyDialogProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCompanyDialog({ company, open, onOpenChange }: EditCompanyDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const handleSubmit = async (data: { name: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: data.name,
          description: data.description,
        })
        .eq('id', company.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success(isRTL ? 'تم تحديث الشركة بنجاح' : 'Company updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث الشركة' : 'Error updating company');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={cn(isRTL && "text-right font-cairo")}>
            {t("companies.editCompany")}
          </DialogTitle>
        </DialogHeader>
        <CompanyForm 
          initialData={company}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
