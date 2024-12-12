import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { useState } from "react";
import { UserForm } from "@/components/forms/UserForm";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AddUser() {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <div className={cn(
        "flex-1 p-8 transition-all duration-300",
        isRTL ? "mr-64" : "ml-64"
      )}>
        <div className="max-w-2xl mx-auto">
          <h1 className={cn(
            "text-2xl font-bold mb-6",
            isRTL && "font-cairo text-right"
          )}>
            {isRTL ? "إضافة مستخدم جديد" : "Add New User"}
          </h1>
          <UserForm
            onSuccess={() => navigate("/users")}
            onCancel={() => navigate("/users")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}