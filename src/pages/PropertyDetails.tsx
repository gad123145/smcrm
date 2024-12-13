import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Property } from "@/types/property";
import { useSidebar } from "@/hooks/use-sidebar";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { PropertyHeader } from "@/components/properties/details/PropertyHeader";
import { PropertyInfo } from "@/components/properties/details/PropertyInfo";
import { PropertyImages } from "@/components/properties/details/PropertyImages";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ShareButton } from "@/components/properties/ShareButton";

export default function PropertyDetails() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      try {
        const storedData = localStorage.getItem("properties");
        if (!storedData) {
          throw new Error("No properties found");
        }

        const properties = JSON.parse(storedData) as Property[];
        const foundProperty = properties.find(p => p.id === id);

        if (!foundProperty) {
          throw new Error("Property not found");
        }

        // Validate and process images
        const processedImages = foundProperty.images?.map(img => {
          // Check if the image is already a base64 string
          if (typeof img === 'string' && img.startsWith('data:image')) {
            return img;
          }
          // If it's a URL, try to convert it to base64
          return img;
        }).filter(Boolean) || [];

        console.log('Loaded property images:', processedImages);

        setProperty({
          ...foundProperty,
          features: foundProperty.features || [],
          images: processedImages,
          status: foundProperty.status || "available",
          hasBasement: foundProperty.hasBasement || false,
          otherDetails: foundProperty.otherDetails || ""
        });
      } catch (error) {
        console.error('Error loading property:', error);
        toast.error(isRTL ? "حدث خطأ أثناء تحميل بيانات العقار" : "Error loading property data");
        navigate('/properties');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id, isRTL, navigate]);

  const handleSubmit = async (data: any) => {
    try {
      const storedData = localStorage.getItem("properties");
      if (!storedData) {
        throw new Error("No properties found");
      }

      const properties = JSON.parse(storedData) as Property[];
      const updatedProperties = properties.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...data,
            images: [...(p.images || []), ...(data.images || [])]
          };
        }
        return p;
      });

      localStorage.setItem("properties", JSON.stringify(updatedProperties));
      setProperty(prev => prev ? { ...prev, ...data } : null);
      toast.success(isRTL ? "تم تحديث العقار بنجاح" : "Property updated successfully");
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث العقار" : "Error updating property");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(
      isRTL 
        ? "هل أنت متأكد من حذف هذا العقار؟ سيتم حذف جميع البيانات المرتبطة به."
        : "Are you sure you want to delete this property? This will delete all associated data."
    )) {
      return;
    }

    try {
      const storedData = localStorage.getItem("properties");
      if (!storedData) {
        throw new Error("No properties found");
      }

      const properties = JSON.parse(storedData) as Property[];
      const updatedProperties = properties.filter(p => p.id !== id);
      localStorage.setItem("properties", JSON.stringify(updatedProperties));

      toast.success(isRTL ? "تم حذف العقار بنجاح" : "Property deleted successfully");
      navigate('/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف العقار" : "Error deleting property");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent className="flex-1">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  if (!property) {
    return (
      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardSidebar open={open} />
        <DashboardContent className="flex-1">
          <div className="text-center py-8">
            {isRTL ? "العقار غير موجود" : "Property not found"}
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
      <DashboardSidebar open={open} />
      <DashboardContent className="flex-1">
        <div className={cn(
          "h-full w-full",
          isRTL ? "font-cairo" : ""
        )}>
          <PropertyHeader property={property} isRTL={isRTL} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <PropertyInfo property={property} onSubmit={handleSubmit} isRTL={isRTL} />
            <PropertyImages images={property.images} />
          </div>

          <div className={cn(
            "flex items-center gap-4 mt-6",
            isRTL && "flex-row-reverse"
          )}>
            <Button
              variant="destructive"
              className={cn("gap-2", isRTL && "flex-row-reverse")}
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              {isRTL ? "حذف العقار" : "Delete Property"}
            </Button>
            <ShareButton property={property} isRTL={isRTL} />
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}
