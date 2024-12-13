import { Property } from "@/types/property";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PropertyDetailsCardProps {
  property: Property;
}

export const PropertyDetailsCard = ({ property }: PropertyDetailsCardProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'معلومات العقار الأساسية' : 'Basic Property Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">
                {isRTL ? 'اسم العقار' : 'Property Title'}
              </h3>
              <p>{property.title}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">
                {isRTL ? 'النوع' : 'Type'}
              </h3>
              <p>{property.type}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">
                {isRTL ? 'السعر' : 'Price'}
              </h3>
              <p>{property.price}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">
                {isRTL ? 'المساحة' : 'Area'}
              </h3>
              <p>{property.area}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'الموقع' : 'Location'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">
                {isRTL ? 'الموقع' : 'Location'}
              </h3>
              <p>{property.location}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">
                {isRTL ? 'المدينة' : 'City'}
              </h3>
              <p>{property.city}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'التفاصيل' : 'Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold mb-1">
              {isRTL ? 'الوصف' : 'Description'}
            </h3>
            <p className={cn("text-muted-foreground", isRTL && "text-right")}>
              {property.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {property.features && property.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? 'المميزات' : 'Features'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {property.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {property.images && property.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? 'الصور' : 'Images'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {property.ownerName && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? 'معلومات المالك' : 'Owner Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1">
                  {isRTL ? 'اسم المالك' : 'Owner Name'}
                </h3>
                <p>{property.ownerName}</p>
              </div>
              {property.ownerPhone && (
                <div>
                  <h3 className="font-semibold mb-1">
                    {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                  </h3>
                  <p>{property.ownerPhone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
