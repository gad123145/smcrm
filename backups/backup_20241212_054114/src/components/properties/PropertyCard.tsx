import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@/components/forms/propertySchema";
import { PropertyViewDialog } from "./PropertyViewDialog";
import { PropertyEditSheet } from "./PropertyEditSheet";
import { ProjectShareDialog } from "../projects/share/ProjectShareDialog";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import { toast } from "sonner";

type PropertyCardProps = {
  property: Property;
  onEdit: (data: Property) => void;
  onDelete: (property: Property) => void;
};

export function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { deleteProject } = useProjectMutations();

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
      await deleteProject.mutateAsync(property.id);
      toast.success(isRTL ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully');
      onDelete(property);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حذف المشروع' : 'Error deleting project');
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
      <CardFooter className={cn(
        "flex gap-2 justify-center"
      )}>
        <PropertyViewDialog property={property} />
        <PropertyEditSheet property={property} onSubmit={onEdit} />
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
  );
}