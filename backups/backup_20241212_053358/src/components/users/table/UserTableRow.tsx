import { User } from "@/types/user";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteUserDialog } from "../DeleteUserDialog";
import { EditUserDialog } from "../EditUserDialog";
import { AdminUserButton } from "../AdminUserButton";
import { UserEnableButton } from "../UserEnableButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PasswordResetButton } from "./PasswordResetButton";

interface UserTableRowProps {
  user: User;
  isAdmin: boolean;
  isRTL: boolean;
  getRoleLabel: (role: string | null) => string;
  getStatusLabel: (status: string | null) => string;
  refetch: () => void;
}

export function UserTableRow({ 
  user, 
  isAdmin, 
  isRTL, 
  getRoleLabel,
  getStatusLabel,
  refetch 
}: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <input type="checkbox" className="rounded border-gray-300" />
      </TableCell>
      <TableCell>{user.full_name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{getRoleLabel(user.role)}</TableCell>
      <TableCell>
        <Button
          variant={user.status === 'active' ? "default" : "secondary"}
          size="sm"
          className={cn(
            user.status === 'active' ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-200",
            "text-white"
          )}
        >
          {getStatusLabel(user.status)}
        </Button>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PasswordResetButton 
                    email={user.email} 
                    isRTL={isRTL}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {isRTL ? "إعادة تعيين كلمة المرور" : "Reset Password"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <EditUserDialog
                    user={user}
                    onUpdate={refetch}
                    editText={<Edit2 className="h-4 w-4 text-blue-500" />}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {isRTL ? "تعديل المستخدم" : "Edit User"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <DeleteUserDialog
                    userId={user.id}
                    userName={user.full_name || ''}
                    onDelete={refetch}
                    deleteText={<Trash2 className="h-4 w-4 text-red-500" />}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {isRTL ? "حذف المستخدم" : "Delete User"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <AdminUserButton userId={user.id} />
                </TooltipTrigger>
                <TooltipContent>
                  {isRTL ? "تعيين كمسؤول" : "Set as Admin"}
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <UserEnableButton userId={user.id} />
                </TooltipTrigger>
                <TooltipContent>
                  {isRTL ? "تفعيل/تعطيل المستخدم" : "Enable/Disable User"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}