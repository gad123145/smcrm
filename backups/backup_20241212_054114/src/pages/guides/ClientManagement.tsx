import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ClientManagement = () => {
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
              <Users className="h-8 w-8 text-primary" />
              <h1 className={cn(
                "text-3xl font-bold",
                isRTL && "font-cairo"
              )}>
                {isRTL ? "إدارة العملاء" : "Client Management"}
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
                {isRTL ? "إدارة علاقات العملاء" : "Client Relationship Management"}
              </h2>
              <div className={cn(
                "prose max-w-none dark:prose-invert",
                isRTL && "text-right"
              )}>
                {isRTL ? (
                  <>
                    <p>تعلم كيفية إدارة العملاء وبناء علاقات طويلة الأمد معهم.</p>
                    <ul>
                      <li>فهم احتياجات العملاء</li>
                      <li>التواصل الفعال</li>
                      <li>إدارة توقعات العملاء</li>
                      <li>برنامج الولاء والمتابعة</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p>Learn how to manage clients and build long-term relationships.</p>
                    <ul>
                      <li>Understanding Client Needs</li>
                      <li>Effective Communication</li>
                      <li>Managing Client Expectations</li>
                      <li>Loyalty and Follow-up Program</li>
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

export default ClientManagement;