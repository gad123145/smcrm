import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@/components/forms/propertySchema";
import { PropertyViewDialog } from "./PropertyViewDialog";
import { PropertyEditSheet } from "./PropertyEditSheet";
import { ProjectShareDialog } from "../projects/details/ProjectShareDialog";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import { toast } from "sonner";
import { useState } from "react";

type PropertyCardProps = {
  property: Property;
  onEdit: (data: Property) => void;
  onDelete: (property: Property) => void;
};

export function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { deleteProject } = useProjectMutations();
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Convert Property to Project type for sharing
  const projectData = {
    id: "",
    name: property.title,
    description: property.description,
    location: property.location,
    operating_company: property.operatingCompany,
    price: `${property.pricePerMeterFrom} - ${property.pricePerMeterTo}`,
    available_units: property.availableUnits,
    images: property.images?.map(img => typeof img === 'string' ? img : URL.createObjectURL(img)) || [],
    user_id: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const handleDelete = async () => {
    try {
      onDelete(property);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      if (error instanceof Error) {
        toast.error(error.message || (isRTL ? 'حدث خطأ أثناء حذف المشروع' : 'Error deleting project'));
      } else {
        toast.error(isRTL ? 'حدث خطأ أثناء حذف المشروع' : 'Error deleting project');
      }
    }
  };

  const handleExport = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [JSON.stringify(property, null, 2)], 
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${property.title}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Card className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isRTL ? "text-right" : "text-left"
      )}>
        <CardHeader>
          <CardTitle className={cn(
            "text-lg font-semibold",
            isRTL ? "font-cairo" : ""
          )}>
            {property.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("projects.form.location")}</p>
              <p className="text-sm">{property.location || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("projects.form.operatingCompany")}</p>
              <p className="text-sm">{property.operatingCompany || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("projects.form.price")}</p>
              <p className="text-sm">{property.pricePerMeterFrom} - {property.pricePerMeterTo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("projects.form.deliveryDate")}</p>
              <p className="text-sm">{property.deliveryDate || "-"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className={cn(
          "flex gap-2 justify-center border-t pt-4"
        )}>
          <PropertyViewDialog property={property} />
          <PropertyEditSheet property={property} onSubmit={onEdit} />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <ProjectShareDialog
        project={projectData}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        isRTL={isRTL}
      />
    </>
  );
}