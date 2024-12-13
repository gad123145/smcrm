import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Share2, Download } from "lucide-react";
import { Property } from "@/types/property";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/properties/ShareButton";
import { downloadAsExcel } from "@/lib/excel";

interface PropertyCardProps {
  property: Property;
  onDelete?: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onClick?: () => void;
  className?: string;
}

export const PropertyCard = ({
  property,
  onDelete,
  onEdit,
  onClick,
  className,
}: PropertyCardProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleDownload = () => {
    const data = [
      {
        [t('properties.form.title')]: property.title,
        [t('properties.form.type')]: property.type,
        [t('properties.form.price')]: property.price,
        [t('properties.form.area')]: property.area,
        [t('properties.form.location')]: property.location,
        [t('properties.form.description')]: property.description,
      },
    ];

    downloadAsExcel(data, `property-${property.id}`);
  };

  return (
    <Card
      className={cn("relative group overflow-hidden", className)}
      onClick={onClick}
    >
      {property.images && property.images[0] && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{property.title}</h3>
          <div className={cn("space-x-2", isRTL && "space-x-reverse")}>
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(property);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(property);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {t('properties.form.type')}
            </span>
            <span>{property.type || t('properties.form.notSpecified')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {t('properties.form.price')}
            </span>
            <span>{property.price ? `$${property.price.toLocaleString()}` : t('properties.form.notSpecified')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {t('properties.form.area')}
            </span>
            <span>{property.area ? `${property.area} m²` : t('properties.form.notSpecified')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {t('properties.form.location')}
            </span>
            <span>{property.location || t('properties.form.notSpecified')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <ShareButton property={property} />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
        >
          <Download className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};