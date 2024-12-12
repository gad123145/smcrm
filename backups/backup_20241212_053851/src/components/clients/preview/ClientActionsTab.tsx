import { useTranslation } from "react-i18next";
import { Client } from "@/data/clientsData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFormFields } from "./ActionFormFields";
import { actionFormSchema, type ActionFormData } from "./actionFormTypes";

interface ClientActionsTabProps {
  client: Client;
}

export function ClientActionsTab({ client }: ClientActionsTabProps) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isRTL = i18n.language === 'ar';

  const form = useForm<ActionFormData>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      nextAction: "",
      comment: "",
      nextActionTime: "",
    },
  });

  const onSubmit = async (values: ActionFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let finalNextActionDate: Date | undefined;
      if (values.nextActionDate && values.nextActionTime) {
        const [hours, minutes] = values.nextActionTime.split(':');
        finalNextActionDate = new Date(values.nextActionDate);
        finalNextActionDate.setHours(parseInt(hours, 10));
        finalNextActionDate.setMinutes(parseInt(minutes, 10));
      }

      const { error: actionError } = await supabase
        .from("client_actions")
        .insert({
          client_id: client.id,
          action_type: values.nextAction || "comment",
          comment: values.comment,
          created_by: user.id
        });

      if (actionError) throw actionError;

      if (values.nextAction || finalNextActionDate) {
        const { error: updateError } = await supabase
          .from("clients")
          .update({
            status: values.nextAction,
            next_action_type: values.nextAction,
            next_action_date: finalNextActionDate?.toISOString()
          })
          .eq("id", client.id);

        if (updateError) throw updateError;
      }

      queryClient.invalidateQueries({ queryKey: ["topUsers"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });

      toast.success(t("clients.preview.actionAdded"));
      form.reset();
    } catch (error) {
      console.error("Error adding action:", error);
      toast.error(t("errors.unexpected"));
    }
  };

  return (
    <div className={cn("space-y-6", isRTL ? "font-cairo" : "")}>
      <Card>
        <CardHeader>
          <CardTitle className={cn(
            "text-xl font-semibold",
            isRTL ? "text-right" : "text-left"
          )}>
            {isRTL ? "الإجراء التالي" : "Next Action"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ActionFormFields form={form} />
              <div className={cn(
                "flex",
                isRTL ? "justify-start" : "justify-end"
              )}>
                <Button 
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    "transition-all duration-200 hover:scale-105",
                    "bg-primary hover:bg-primary/90",
                    "text-white font-medium",
                    "shadow-sm hover:shadow-md"
                  )}
                >
                  {isRTL ? "حفظ الإجراء" : "Save Action"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}