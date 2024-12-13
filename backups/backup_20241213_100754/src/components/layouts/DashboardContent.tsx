import React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useSidebar } from "@/components/ui/sidebar";

type DashboardContentProps = {
  children?: React.ReactNode;
  className?: string;
};

export function DashboardContent({ children, className }: DashboardContentProps) {
  const { i18n } = useTranslation();
  const { open } = useSidebar();
  const isRTL = i18n.language === 'ar';

  return (
    <main
      className={cn(
        "flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300",
        open ? (isRTL ? "mr-64" : "ml-64") : "m-0",
        isRTL && "font-cairo",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </main>
  );
}