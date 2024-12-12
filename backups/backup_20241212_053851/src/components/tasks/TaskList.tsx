import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TaskActions } from "./TaskActions";
import type { Task } from "./taskSchema";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "yyyy-MM-dd HH:mm");
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {tasks.map((task) => (
        <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
          <div className={cn(
            "flex justify-between items-start",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={cn(
              "space-y-1",
              isRTL ? "text-right" : "text-left"
            )}>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {task.description}
              </p>
              <div className={cn(
                "flex gap-2 text-sm",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                {task.due_date && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("tasks.form.dueDate")}: {formatDate(task.due_date)}
                  </span>
                )}
                {task.assignee?.full_name && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("tasks.form.assignedTo")}: {task.assignee.full_name}
                  </span>
                )}
              </div>
              <div className={cn(
                "flex gap-2",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                <Badge className={getPriorityColor(task.priority)}>
                  {t(`tasks.priority.${task.priority}`)}
                </Badge>
                <Badge className={getStatusColor(task.status)}>
                  {t(`tasks.status.${task.status}`)}
                </Badge>
              </div>
            </div>
            <TaskActions task={task} />
          </div>
        </div>
      ))}
    </div>
  );
}