import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { Card, CardContent } from "@/components/ui/card";
import { Building, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ProjectManagement = () => {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isRTL = i18n.language === 'ar';

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <DashboardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-primary" />
              <h1 className={cn(
                "text-3xl font-bold",
                isRTL && "font-cairo"
              )}>
                {isRTL ? "إدارة المشاريع" : "Project Management"}
              </h1>
            </div>
            <Button variant="outline" asChild>
              <Link to="/guides" className="flex items-center gap-2">
                {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                {isRTL ? "العودة" : "Back"}
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className={cn(
                "text-2xl font-semibold mb-4",
                isRTL && "font-cairo text-right"
              )}>
                {isRTL ? "إدارة المشاريع العقارية" : "Real Estate Project Management"}
              </h2>
              <div className={cn(
                "prose max-w-none dark:prose-invert",
                isRTL && "text-right"
              )}>
                {isRTL ? (
                  <>
                    <p>دليل شامل لإدارة المشاريع العقارية بكفاءة وفعالية.</p>
                    <ul>
                      <li>تخطيط المشروع</li>
                      <li>إدارة الموارد</li>
                      <li>متابعة التقدم</li>
                      <li>إدارة المخاطر</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p>A comprehensive guide to managing real estate projects efficiently and effectively.</p>
                    <ul>
                      <li>Project Planning</li>
                      <li>Resource Management</li>
                      <li>Progress Tracking</li>
                      <li>Risk Management</li>
                    </ul>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
};

export default ProjectManagement;