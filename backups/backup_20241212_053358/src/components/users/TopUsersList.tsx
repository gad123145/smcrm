import { TopUser } from "@/types/userTypes";
import { UserRankItem } from "./UserRankItem";
import { cn } from "@/lib/utils";

interface TopUsersListProps {
  users: TopUser[];
  isRTL: boolean;
}

export function TopUsersList({ users, isRTL }: TopUsersListProps) {
  return (
    <div className={cn(
      "space-y-4",
      isRTL && "font-cairo"
    )}>
      {users.map((user: TopUser, index: number) => (
        <UserRankItem 
          key={user.user_id} 
          user={user} 
          index={index}
          showCrown={index === 0}
        />
      ))}
      {users.length === 0 && (
        <div className={cn(
          "text-center text-gray-500 dark:text-gray-400",
          isRTL && "font-cairo"
        )}>
          {isRTL ? "لا يوجد مستخدمين" : "No users"}
        </div>
      )}
    </div>
  );
}