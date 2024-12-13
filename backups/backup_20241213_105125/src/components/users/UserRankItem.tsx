import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { TopUser } from "@/types/userTypes";
import { cn } from "@/lib/utils";

interface UserRankItemProps {
  user: TopUser;
  index: number;
  showCrown?: boolean;
}

export function UserRankItem({ user, index, showCrown = false }: UserRankItemProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const getRankIcon = (index: number, showCrown: boolean) => {
    if (showCrown) {
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    }
    return null;
  };

  const getRoleTranslation = (role: string | null) => {
    if (!role) return '';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return t('users.admin');
      case 'employee':
        return t('users.employee');
      case 'supervisor':
        return t('users.supervisor');
      case 'sales':
        return t('users.sales');
      default:
        return role;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || ""} />
            <AvatarFallback>
              {user.full_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {showCrown && (
            <div className="absolute -top-1 -right-1">
              {getRankIcon(index, showCrown)}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{user.full_name}</p>
          <div className="flex flex-col text-xs">
            <span className="text-muted-foreground">
              {t("dashboard.actions")}: {user.action_count}
            </span>
            {user.role && (
              <span className="text-muted-foreground">
                {getRoleTranslation(user.role)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}