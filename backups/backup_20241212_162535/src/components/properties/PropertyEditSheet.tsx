import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Property } from "@/components/forms/propertySchema";
import { PropertyForm } from "@/components/forms/PropertyForm";

export interface PropertyEditSheetProps {
  property: Property;
  onSubmit: (data: Property) => void;
}

export function PropertyEditSheet({ property, onSubmit }: PropertyEditSheetProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const defaultValues: Partial<Property> = {
    id: property.id,
    title: property.title,
    description: property.description || "",
    location: property.location || "",
    operatingCompany: property.operatingCompany || "",
    projectSections: property.projectSections || "",
    availableUnits: property.availableUnits || "",
    area: property.area || "",
    price: property.price || "",
    images: property.images || [],
    ownerName: property.ownerName || "",
    engineeringConsultant: property.engineeringConsultant || "",
    pricePerMeterFrom: property.pricePerMeterFrom || "",
    pricePerMeterTo: property.pricePerMeterTo || "",
    unitPriceFrom: property.unitPriceFrom || "",
    unitPriceTo: property.unitPriceTo || "",
    minArea: property.minArea || "",
    rentalSystem: property.rentalSystem || "",
    ownerPhone: property.ownerPhone || "",
    developerId: property.developerId || "",
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "right" : "left"} className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className={isRTL ? "text-right font-cairo" : ""}>
            {t("properties.editProperty")}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <PropertyForm
            onSubmit={onSubmit}
            onCancel={() => {
              const sheet = document.querySelector('[data-state="open"]');
              if (sheet) {
                const closeButton = sheet.querySelector('button[aria-label="Close"]');
                if (closeButton) {
                  (closeButton as HTMLButtonElement).click();
                }
              }
            }}
            defaultValues={defaultValues}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}