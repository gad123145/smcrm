import { format } from "date-fns";

type NotificationItemProps = {
  notification: {
    id: string;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
  };
  onClick: (notification: any) => void;
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <div
      key={notification.id}
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
        !notification.is_read ? "bg-blue-50 dark:bg-blue-900/10" : ""
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {format(new Date(notification.created_at), "PPp")}
          </p>
        </div>
      </div>
    </div>
  );
}