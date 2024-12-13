import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Property } from "@/components/forms/propertySchema";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface DetailItemProps {
  label: string;
  value?: string | null;
}

function DetailItem({ label, value }: DetailItemProps) {
  if (!value) return null;
  
  return (
    <div className="space-y-1">
      <h3 className="font-semibold">{label}</h3>
      <p className="text-muted-foreground">{value}</p>
    </div>
  );
}

interface PropertyViewFieldsProps {
  property: Property;
  isRTL?: boolean;
}

export function PropertyViewFields({ property, isRTL = true }: PropertyViewFieldsProps) {
  const { t } = useTranslation();

  // Translate property types
  const translatedTypes = property.types?.map(type => t(`projects.types.${type}`)).join(', ');

  return (
    <div className="space-y-6">
      {/* Images Carousel */}
      {property.images && property.images.length > 0 && (
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {property.images.map((img, index) => (
                <CarouselItem key={index}>
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                      alt={`${property.title || ''} - ${isRTL ? 'صورة' : 'Image'} ${index + 1}`}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {isRTL ? `${property.images.length} صور` : `${property.images.length} images`}
          </p>
        </div>
      )}

      {/* Property Details */}
      <div className={cn(
        "grid gap-4",
        isRTL ? "text-right" : ""
      )}>
        <DetailItem 
          label={isRTL ? "نوع المشروع" : "Project Type"}
          value={translatedTypes}
        />
        <DetailItem 
          label={isRTL ? "الموقع" : "Location"} 
          value={property.location} 
        />
        <DetailItem 
          label={isRTL ? "السعر" : "Price"} 
          value={property.price} 
        />
        <DetailItem 
          label={isRTL ? "المساحة" : "Area"} 
          value={property.area} 
        />
        <DetailItem 
          label={isRTL ? "سعر المتر من" : "Price Per Meter From"} 
          value={property.pricePerMeterFrom} 
        />
        <DetailItem 
          label={isRTL ? "سعر المتر إلى" : "Price Per Meter To"} 
          value={property.pricePerMeterTo} 
        />
        <DetailItem 
          label={isRTL ? "شركة الإدارة والتشغيل" : "Operating Company"} 
          value={property.operatingCompany} 
        />
        <DetailItem 
          label={isRTL ? "العنوان" : "Address"} 
          value={property.address} 
        />
        <DetailItem 
          label={isRTL ? "تاريخ التسليم" : "Delivery Date"} 
          value={property.deliveryDate} 
        />
        <DetailItem 
          label={isRTL ? "رقم هاتف المالك" : "Owner Phone"} 
          value={property.ownerPhone} 
        />
        
        {/* Description */}
        {property.description && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {isRTL ? "التفاصيل" : "Description"}
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {property.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}