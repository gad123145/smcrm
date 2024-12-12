import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { LocationFields } from "./fields/LocationFields";
import { ProjectFields } from "./fields/ProjectFields";
import { ContactFields } from "./fields/ContactFields";
import { NextActionFields } from "./fields/NextActionFields";

type ClientFormFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  countries: Array<{ code: string; name: string; flag: string; phoneCode: string }>;
  projects: string[];
  salesPersons: string[];
  contactMethods: string[];
};

export function ClientFormFields({ form, countries, projects, salesPersons, contactMethods }: ClientFormFieldsProps) {
  return (
    <>
      <BasicInfoFields form={form} />
      <LocationFields form={form} countries={countries} />
      <ProjectFields form={form} projects={projects} />
      <ContactFields form={form} salesPersons={salesPersons} contactMethods={contactMethods} />
      <NextActionFields form={form} />
    </>
  );
}