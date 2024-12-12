import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Permission = {
  key: string;
  label: string;
  category: string;
};

const availablePermissions: Permission[] = [
  // Users
  { key: "users.create", label: "إضافة مستخدمين", category: "المستخدمين" },
  { key: "users.edit", label: "تعديل مستخدمين", category: "المستخدمين" },
  { key: "users.delete", label: "حذف مستخدمين", category: "المستخدمين" },
  { key: "users.assign", label: "تعيين مستخدمين", category: "المستخدمين" },
  
  // Clients
  { key: "clients.create", label: "إضافة عملاء", category: "العملاء" },
  { key: "clients.edit", label: "تعديل عملاء", category: "العملاء" },
  { key: "clients.delete", label: "حذف عملاء", category: "العملاء" },
  { key: "clients.import", label: "استيراد عملاء", category: "العملاء" },
  { key: "clients.export", label: "تصدير عملاء", category: "العملاء" },
  { key: "clients.assign", label: "تعيين عملاء", category: "العملاء" },
  
  // Projects
  { key: "projects.create", label: "إضافة مشاريع", category: "المشاريع" },
  { key: "projects.edit", label: "تعديل مشاريع", category: "المشاريع" },
  { key: "projects.delete", label: "حذف مشاريع", category: "المشاريع" },
  
  // Tasks
  { key: "tasks.create", label: "إضافة مهام", category: "المهام" },
  { key: "tasks.edit", label: "تعديل مهام", category: "المهام" },
  { key: "tasks.delete", label: "حذف مهام", category: "المهام" },

  // Companies
  { key: "companies.create", label: "إضافة شركات", category: "الشركات" },
  { key: "companies.edit", label: "تعديل شركات", category: "الشركات" },
  { key: "companies.delete", label: "حذف شركات", category: "الشركات" },
  { key: "companies.view", label: "عرض الشركات", category: "الشركات" },

  // AI Assistant
  { key: "ai.unlimited", label: "رسائل غير محدودة للمساعد الذكي", category: "المساعد الذكي" },
  { key: "ai.limited", label: "رسائل محدودة للمساعد الذكي (50 يومياً)", category: "المساعد الذكي" },
];

interface PermissionsListProps {
  selectedPermissions: string[];
  onPermissionToggle: (permission: string) => void;
  isRTL: boolean;
}

export function PermissionsList({ 
  selectedPermissions, 
  onPermissionToggle,
  isRTL 
}: PermissionsListProps) {
  const { t } = useTranslation();
  
  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6">
        {Object.entries(groupedPermissions).map(([category, permissions]) => (
          <div key={category} className="space-y-3">
            <h3 className={cn(
              "font-semibold text-lg",
              isRTL && "text-right font-cairo"
            )}>
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissions.map((permission) => (
                <div key={permission.key} className={cn(
                  "flex items-center space-x-2",
                  isRTL && "space-x-reverse"
                )}>
                  <Checkbox
                    id={permission.key}
                    checked={selectedPermissions.includes(permission.key)}
                    onCheckedChange={() => onPermissionToggle(permission.key)}
                  />
                  <Label 
                    htmlFor={permission.key}
                    className={cn(isRTL && "font-cairo")}
                  >
                    {permission.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}