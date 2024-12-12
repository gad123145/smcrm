import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Task } from "@/components/tasks/taskSchema";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { cn } from "@/lib/utils";

const Tasks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const isRTL = i18n.language === 'ar';

  useRealtimeSubscription('tasks', ['tasks']);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('Fetching tasks...');
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles(
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        throw tasksError;
      }

      console.log('Tasks data:', tasksData);
      return tasksData as Task[];
    },
  });

  const handleTaskSuccess = () => {
    setIsAddingTask(false);
    toast.success(t("tasks.addSuccess"));
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <DashboardSidebar open={sidebarOpen} />
      <main className={cn(
        "flex-1 p-6 transition-all duration-300",
        isRTL ? "mr-64" : "ml-64"
      )}>
        <div className={cn(
          "flex justify-between items-center mb-6",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          <h1 className="text-2xl font-semibold">{t("tasks.title")}</h1>
          <Sheet open={isAddingTask} onOpenChange={setIsAddingTask}>
            <SheetTrigger asChild>
              <Button className={cn(
                "gap-2",
                isRTL ? "flex-row-reverse" : ""
              )}>
                <Plus className="w-4 h-4" />
                {t("tasks.addTask")}
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "right" : "left"}>
              <SheetHeader>
                <SheetTitle>{t("tasks.addTask")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <TaskForm
                  onSuccess={handleTaskSuccess}
                  onCancel={() => setIsAddingTask(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Card className="p-0">
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="p-4 text-center">{t("tasks.loading")}</div>
            ) : (
              <TaskList tasks={tasks} />
            )}
          </ScrollArea>
        </Card>
      </main>
    </DashboardLayout>
  );
};

export default Tasks;