import React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type DashboardContentProps = {
  children?: React.ReactNode;
  className?: string;
};

export function DashboardContent({ children, className }: DashboardContentProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <main
      className={cn(
        "flex-1 overflow-y-auto p-4 md:p-6",
        isRTL ? "mr-64" : "ml-64",
        isRTL && "font-cairo",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </main>
  );
}