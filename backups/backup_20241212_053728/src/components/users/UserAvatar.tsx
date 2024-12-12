import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  user: {
    full_name?: string | null;
    avatar?: string | null;
  };
  className?: string;
  onAvatarUpload?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading?: boolean;
}

export function UserAvatar({ user, className, onAvatarUpload, uploading }: UserAvatarProps) {
  return (
    <Avatar className={cn("h-10 w-10", className)}>
      <AvatarImage src={user.avatar || undefined} alt={user.full_name || undefined} />
      <AvatarFallback>
        {user.full_name?.charAt(0).toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
}