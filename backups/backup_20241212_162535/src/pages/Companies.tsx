import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { AddCompanyDialog } from "@/components/companies/AddCompanyDialog";
import { useNavigate } from "react-router-dom";

export default function Companies() {
  const { t, i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
      <DashboardSidebar open={open} />
      <DashboardContent>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-primary" />
                  <h1 className={cn(
                    "text-3xl font-bold text-gray-900 dark:text-white",
                    isRTL ? "font-cairo" : ""
                  )}>
                    {t("companies.title")}
                  </h1>
                </div>
                <AddCompanyDialog />
              </div>
              
              <p className={cn(
                "text-gray-600 dark:text-gray-300 text-center mb-8",
                isRTL ? "font-cairo" : ""
              )}>
                {t("companies.description")}
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                  <Card 
                    key={company.id} 
                    className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className={cn(
                        "flex items-center gap-2",
                        isRTL ? "flex-row-reverse font-cairo" : ""
                      )}>
                        {company.logo && (
                          <img 
                            src={company.logo} 
                            alt={company.name} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span>{company.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={cn(
                        "text-sm text-gray-600 dark:text-gray-300",
                        isRTL ? "text-right font-cairo" : ""
                      )}>
                        {company.description || t("companies.noDescription")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}