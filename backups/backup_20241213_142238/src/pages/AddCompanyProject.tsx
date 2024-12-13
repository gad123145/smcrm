import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { toast } from "sonner";
import { addProject } from "@/lib/projects";
import type { Property } from "@/types/property";

export default function AddCompanyProject() {
  const { id: companyId } = useParams(); // This is the company ID
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const handleSubmit = async (data: Property) => {
    try {
      if (!companyId) {
        toast.error(isRTL ? "معرف الشركة غير صالح" : "Invalid company ID");
        return;
      }

      const result = await addProject({
        name: data.title,
        description: data.description,
        type: data.type,
        manager: data.manager,
        start_date: data.start_date,
        status: data.status,
        priority: data.priority,
        price: data.price,
        project_area: data.area,
        images: data.images || [],
        location: data.location,
        operating_company: data.operating_company,
      }, companyId);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(isRTL ? "تم إضافة المشروع بنجاح" : "Project added successfully");
      navigate(`/companies/${companyId}`);
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(isRTL ? "حدث خطأ أثناء إضافة المشروع" : "Error adding project");
    }
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <DashboardContent className="flex-1">
        <div className={cn(
          "max-w-2xl mx-auto py-6",
          isRTL ? "font-cairo" : ""
        )}>
          <h1 className={cn(
            "text-2xl font-semibold mb-6",
            isRTL ? "text-right" : "text-left"
          )}>
            {t("projects.addProject")}
          </h1>
          <PropertyForm onSubmit={handleSubmit} isRTL={isRTL} />
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}