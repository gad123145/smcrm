import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { BookOpen, Star, Users, Building } from "lucide-react";
import { Link } from "react-router-dom";

const Guides = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const guides = [
    {
      title: isRTL ? "دليل المبيعات" : "Sales Guide",
      description: isRTL ? "تعرف على أفضل ممارسات المبيعات وكيفية إغلاق الصفقات" : "Learn about sales best practices and how to close deals",
      icon: Star,
      path: "/guides/sales"
    },
    {
      title: isRTL ? "إدارة العملاء" : "Client Management",
      description: isRTL ? "كيفية إدارة العملاء وبناء علاقات طويلة الأمد" : "How to manage clients and build long-term relationships",
      icon: Users,
      path: "/guides/client-management"
    },
    {
      title: isRTL ? "إدارة المشاريع" : "Project Management",
      description: isRTL ? "دليل شامل لإدارة المشاريع العقارية" : "Comprehensive guide to real estate project management",
      icon: Building,
      path: "/guides/project-management"
    },
  ];

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <DashboardContent>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className={cn(
              "text-3xl font-bold",
              isRTL && "font-cairo"
            )}>
              {isRTL ? "الأدلة الإرشادية" : "Guides"}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link 
                key={guide.title} 
                to={guide.path}
                className="block"
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <guide.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                      <CardTitle className={cn(
                        "text-xl",
                        isRTL && "font-cairo"
                      )}>
                        {guide.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={cn(
                      "text-gray-600 dark:text-gray-300 leading-relaxed",
                      isRTL && "font-cairo text-right"
                    )}>
                      {guide.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
};

export default Guides;