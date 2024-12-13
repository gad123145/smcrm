import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { toast } from "sonner";
import { Property } from "@/types/property";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import cn from "classnames";

export default function EditProperty() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { open, setOpen } = useSidebar();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setIsLoading(true);
      const storedData = localStorage.getItem("properties");
      if (!storedData) {
        throw new Error("No properties found");
      }

      const properties = JSON.parse(storedData) as Property[];
      const foundProperty = properties.find(p => p.id === id);

      if (!foundProperty) {
        throw new Error("Property not found");
      }

      setProperty(foundProperty);
    } catch (error) {
      console.error('Error fetching property details:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحميل تفاصيل العقار' : 'Error loading property details');
      navigate('/properties');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (updatedProperty: Property) => {
    try {
      const storedData = localStorage.getItem("properties");
      if (!storedData) {
        throw new Error("No properties found");
      }

      const properties = JSON.parse(storedData) as Property[];
      const updatedProperties = properties.map(p => 
        p.id === id ? { ...updatedProperty, id } : p
      );

      localStorage.setItem("properties", JSON.stringify(updatedProperties));
      toast.success(isRTL ? 'تم تحديث العقار بنجاح' : 'Property updated successfully');
      navigate('/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث العقار' : 'Error updating property');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSidebar open={open} setOpen={setOpen}>
          <div className="h-screen animate-pulse bg-muted" />
        </DashboardSidebar>
        <ScrollArea className="flex-1">
          <div className="container mx-auto p-6">
            <div className="space-y-4">
              <div className="h-8 w-[200px] animate-pulse rounded-md bg-muted" />
              <div className="h-[400px] animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        </ScrollArea>
      </DashboardLayout>
    );
  }

  if (!property) {
    return (
      <DashboardLayout>
        <DashboardSidebar open={open} setOpen={setOpen}>
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              {isRTL ? 'لم يتم العثور على العقار' : 'Property not found'}
            </p>
          </div>
        </DashboardSidebar>
        <ScrollArea className="flex-1">
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              {isRTL ? 'لم يتم العثور على العقار' : 'Property not found'}
            </p>
          </div>
        </ScrollArea>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
      <DashboardSidebar open={open} />
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        open ? (isRTL ? "mr-64" : "ml-64") : "m-0"
      )}>
        <div className={cn(
          "container mx-auto p-6",
          isRTL && "font-cairo"
        )}>
          <div className="flex items-center justify-between mb-6">
            <h1 className={cn(
              "text-2xl font-bold",
              isRTL && "text-right"
            )}>
              {isRTL ? 'تعديل العقار' : 'Edit Property'}
            </h1>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <PropertyForm
              initialData={property}
              onSubmit={handleSubmit}
              isEditing={true}
            />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
