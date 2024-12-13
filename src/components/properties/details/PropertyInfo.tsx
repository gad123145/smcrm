import { Property } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Home,
  MapPin,
  DollarSign,
  Ruler,
  User,
  Phone,
  Check,
  X,
  Building2,
  Info
} from "lucide-react";

interface PropertyInfoProps {
  property: Property;
  onSubmit?: (data: any) => void;
  isRTL: boolean;
}

export function PropertyInfo({ property, isRTL }: PropertyInfoProps) {
  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | boolean }) => (
    <div className={cn(
      "flex items-center gap-3",
      isRTL && "flex-row-reverse"
    )}>
      <div className="p-2 bg-muted rounded-lg">
        <Icon className="w-4 h-4" />
      </div>
      <div className={cn(
        "flex flex-col",
        isRTL && "items-end"
      )}>
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-medium">
          {typeof value === 'boolean' ? (
            value ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )
          ) : (
            value
          )}
        </span>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(
          "text-lg font-semibold",
          isRTL && "text-right"
        )}>
          {isRTL ? "معلومات العقار" : "Property Information"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            icon={Home}
            label={isRTL ? "نوع العقار" : "Property Type"}
            value={property.type}
          />
          <InfoItem
            icon={MapPin}
            label={isRTL ? "الموقع" : "Location"}
            value={`${property.location}, ${property.city}`}
          />
          <InfoItem
            icon={DollarSign}
            label={isRTL ? "السعر" : "Price"}
            value={property.price}
          />
          <InfoItem
            icon={Ruler}
            label={isRTL ? "المساحة" : "Area"}
            value={`${property.area} ${isRTL ? "متر مربع" : "sqm"}`}
          />
          <InfoItem
            icon={User}
            label={isRTL ? "اسم المالك" : "Owner Name"}
            value={property.ownerName || (isRTL ? "غير متوفر" : "Not available")}
          />
          <InfoItem
            icon={Phone}
            label={isRTL ? "رقم الهاتف" : "Phone Number"}
            value={property.ownerPhone || (isRTL ? "غير متوفر" : "Not available")}
          />
          <InfoItem
            icon={Building2}
            label={isRTL ? "يوجد قبو" : "Has Basement"}
            value={property.hasBasement}
          />
          {property.otherDetails && (
            <InfoItem
              icon={Info}
              label={isRTL ? "تفاصيل إضافية" : "Other Details"}
              value={property.otherDetails}
            />
          )}
        </div>

        {property.features && property.features.length > 0 && (
          <div className="mt-6">
            <h3 className={cn(
              "font-semibold mb-3",
              isRTL && "text-right"
            )}>
              {isRTL ? "المميزات" : "Features"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {property.features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {property.description && (
          <div className="mt-6">
            <h3 className={cn(
              "font-semibold mb-3",
              isRTL && "text-right"
            )}>
              {isRTL ? "الوصف" : "Description"}
            </h3>
            <p className={cn(
              "text-sm text-muted-foreground whitespace-pre-wrap",
              isRTL && "text-right"
            )}>
              {property.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
