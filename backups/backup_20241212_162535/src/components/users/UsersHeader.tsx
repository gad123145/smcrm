import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type UsersHeaderProps = {
  isAdmin: boolean;
  isRTL: boolean;
};

export function UsersHeader({ isAdmin, isRTL }: UsersHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">المستخدمين | Users</h1>
      {isAdmin && (
        <Button onClick={() => navigate("/users/add")}>
          <UserPlus className="ml-2 h-4 w-4" />
          {isRTL ? 'إضافة مستخدم' : 'Add User'}
        </Button>
      )}
    </div>
  );
}