import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CompanyForm } from "@/components/forms/CompanyForm";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { createCompany } from "@/storage/CompanyStorage";

export function AddCompanyDialog() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: { name: string; email?: string; phone?: string; address?: string }) => {
    try {
      const newCompany = createCompany(data);
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success(isRTL ? 'تم إضافة الشركة بنجاح' : 'Company added successfully');
      setOpen(false);
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء إضافة الشركة' : 'Error adding company');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        {t("companies.addCompany")}
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={cn(isRTL && "text-right font-cairo")}>
            {t("companies.addCompany")}
          </DialogTitle>
        </DialogHeader>
        <CompanyForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}