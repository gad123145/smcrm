import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "./formSchema";
import { ClientFormFields } from "./ClientFormFields";
import { arabCountries } from "@/data/countries";
import { useTranslation } from "react-i18next";

interface ClientFormProps {
  onSubmit: (data: FormData) => void;
}

export function ClientForm({ onSubmit }: ClientFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      facebook: "",
      country: "",
      city: "",
      project: "",
      budget: "",
      sales_person: "",
      contact_method: "phone",
      status: "new",
      next_action_date: undefined,
      next_action_type: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ClientFormFields
          form={form}
          countries={arabCountries}
          projects={[]}
          salesPersons={[]}
          contactMethods={["phone", "whatsapp", "email", "facebook"]}
        />
        <Button type="submit" className="w-full">
          {isRTL ? "إضافة عميل" : "Add Client"}
        </Button>
      </form>
    </Form>
  );
}