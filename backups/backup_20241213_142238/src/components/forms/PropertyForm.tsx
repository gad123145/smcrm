import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Property, propertySchema } from "./propertySchema";
import { toast } from "sonner";

interface PropertyFormProps {
  onSubmit: (data: Property) => void;
  initialData?: Property;
  isEditing?: boolean;
}

export function PropertyForm({ onSubmit, initialData, isEditing }: PropertyFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const form = useForm<Property>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      id: initialData?.id || crypto.randomUUID(),
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || "",
      price: initialData?.price || 0,
      area: initialData?.area || 0,
      location: initialData?.location || "",
      city: initialData?.city || "",
      features: initialData?.features || [],
      images: initialData?.images || [],
      ownerName: initialData?.ownerName || "",
      ownerPhone: initialData?.ownerPhone || "",
      status: initialData?.status || "available",
      hasBasement: initialData?.hasBasement || false,
      otherDetails: initialData?.otherDetails || "",
    },
  });

  const propertyTypes = [
    { value: "apartment", label: isRTL ? "شقة" : "Apartment" },
    { value: "villa", label: isRTL ? "فيلا" : "Villa" },
    { value: "duplex", label: isRTL ? "دوبلكس" : "Duplex" },
    { value: "commercial", label: isRTL ? "تجاري" : "Commercial" },
    { value: "other", label: isRTL ? "أخرى" : "Other" },
  ];

  const propertyStatus = [
    { value: "available", label: isRTL ? "متاح" : "Available" },
    { value: "sold", label: isRTL ? "تم البيع" : "Sold" },
    { value: "rented", label: isRTL ? "مؤجر" : "Rented" },
    { value: "underContract", label: isRTL ? "تحت العقد" : "Under Contract" },
  ];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imagePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result);
        };
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Images = await Promise.all(imagePromises);
      form.setValue('images', [...(form.getValues('images') || []), ...base64Images]);
      toast.success(isRTL ? "تم رفع الصور بنجاح" : "Images uploaded successfully");
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error(isRTL ? "حدث خطأ أثناء معالجة الصور" : "Error processing images");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={cn("space-y-6", isRTL && "text-right")}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {isRTL ? "المعلومات الأساسية" : "Basic Information"}
            </h2>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? "عنوان العقار" : "Property Title"}</FormLabel>
                  <FormControl>
                    <Input placeholder={isRTL ? "أدخل عنوان العقار" : "Enter property title"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? "الوصف" : "Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={isRTL ? "أدخل وصف العقار" : "Enter property description"}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? "نوع العقار" : "Property Type"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر نوع العقار" : "Select property type"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? "السعر" : "Price"}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={isRTL ? "أدخل السعر" : "Enter price"}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? "المساحة" : "Area"}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={isRTL ? "أدخل المساحة" : "Enter area"}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? "العنوان" : "Location"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={isRTL ? "أدخل العنوان" : "Enter location"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? "المدينة" : "City"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={isRTL ? "أدخل المدينة" : "Enter city"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {isRTL ? "معلومات المالك" : "Owner Information"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? "اسم المالك" : "Owner Name"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={isRTL ? "أدخل اسم المالك" : "Enter owner name"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRTL ? "رقم الهاتف" : "Phone Number"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={isRTL ? "أدخل رقم الهاتف" : "Enter phone number"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {isRTL ? "معلومات إضافية" : "Additional Information"}
            </h2>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? "حالة العقار" : "Property Status"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر حالة العقار" : "Select property status"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyStatus.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasBasement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {isRTL ? "يوجد قبو" : "Has Basement"}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? "تفاصيل إضافية" : "Other Details"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={isRTL ? "أدخل أي تفاصيل إضافية" : "Enter any additional details"}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {isRTL ? "الصور" : "Images"}
            </h2>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? "صور العقار" : "Property Images"}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className={cn(isRTL && "flex-row-reverse")}>
          {isRTL ? (isEditing ? "تحديث العقار" : "إضافة العقار") : (isEditing ? "Update Property" : "Add Property")}
        </Button>
      </form>
    </Form>
  );
}