import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getCompanyById, updateCompany } from "@/storage/CompanyStorage";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function EditCompany() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      const companyData = getCompanyById(id);
      if (companyData) {
        setCompany(companyData);
        setName(companyData.name);
        setDescription(companyData.description || "");
      }
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      await updateCompany(id, {
        name,
        description,
      });
      
      toast.success(isRTL ? "تم تحديث الشركة بنجاح" : "Company updated successfully");
      navigate("/companies");
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث الشركة" : "Error updating company");
    }
  };

  if (!company) {
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isRTL ? "جاري التحميل..." : "Loading..."}
            </p>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
      <DashboardSidebar open={open} />
      <DashboardContent>
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => navigate("/companies")}
            >
              <ArrowLeft className="h-4 w-4" />
              {isRTL ? "العودة إلى الشركات" : "Back to Companies"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "تعديل الشركة" : "Edit Company"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRTL ? "اسم الشركة" : "Company Name"}
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRTL ? "أدخل اسم الشركة" : "Enter company name"}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRTL ? "وصف الشركة" : "Company Description"}
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={isRTL ? "أدخل وصف الشركة" : "Enter company description"}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    {isRTL ? "حفظ التغييرات" : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}
