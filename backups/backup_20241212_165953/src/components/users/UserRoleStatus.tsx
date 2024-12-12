import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type UserRoleStatusProps = {
  role: string;
  status: string;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  disabled?: boolean;
};

export function UserRoleStatus({ 
  role, 
  status, 
  onRoleChange, 
  onStatusChange,
  disabled = false 
}: UserRoleStatusProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="role" className={cn(isRTL && "font-cairo")}>
          {isRTL ? "المسمى الوظيفي" : "Job Title"}
        </Label>
        <Select value={role} onValueChange={onRoleChange} disabled={disabled}>
          <SelectTrigger className={cn(isRTL && "font-cairo text-right")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin" className={cn(isRTL && "font-cairo text-right")}>
              {isRTL ? "مدير النظام" : "System Administrator"}
            </SelectItem>
            <SelectItem value="supervisor" className={cn(isRTL && "font-cairo text-right")}>
              {isRTL ? "مشرف" : "Supervisor"}
            </SelectItem>
            <SelectItem value="sales" className={cn(isRTL && "font-cairo text-right")}>
              {isRTL ? "مندوب مبيعات" : "Sales Representative"}
            </SelectItem>
            <SelectItem value="employee" className={cn(isRTL && "font-cairo text-right")}>
              {isRTL ? "موظف" : "Employee"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status" className={cn(isRTL && "font-cairo")}>
          {isRTL ? "حالة الحساب" : "Account Status"}
        </Label>
        <Select value={status} onValueChange={onStatusChange} disabled={disabled}>
          <SelectTrigger className={cn(isRTL && "font-cairo text-right")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active" className={cn(isRTL && "font-cairo text-right")}>
              {isRTL ? "نشط" : "Active"}
            </SelectItem>
            <SelectItem value="inactive" className={cn(isRTL && "font-cairo text-right")}>
              {isRTL ? "غير نشط" : "Inactive"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}