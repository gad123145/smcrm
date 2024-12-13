import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Property } from "@/components/forms/propertySchema";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { cn } from "@/lib/utils";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const Properties = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isRTL = i18n.language === 'ar';

  useRealtimeSubscription('properties', ['properties']);

  // Fetch properties when component mounts
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: isRTL ? 'حدث خطأ أثناء تحميل العقارات' : 'Error loading properties',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProperty = async (data: Property) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast({
          title: t("errors.unauthorized"),
          variant: "destructive",
        });
        return;
      }

      let uploadedImageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        for (const imageUrl of data.images) {
          if (typeof imageUrl === 'string' && imageUrl.startsWith('blob:')) {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
            
            const fileName = `${Math.random()}.jpg`;
            const { error: uploadError, data: uploadData } = await supabase.storage
              .from('projects')
              .upload(fileName, file);

            if (uploadError) {
              console.error('Error uploading image:', uploadError);
              continue;
            }

            if (uploadData) {
              const { data: { publicUrl } } = supabase.storage
                .from('projects')
                .getPublicUrl(uploadData.path);
              uploadedImageUrls.push(publicUrl);
            }
          } else {
            uploadedImageUrls.push(imageUrl);
          }
        }
      }

      const { error } = await supabase.from('properties').insert({
        title: data.title,
        description: data.description,
        type: data.type,
        area: data.area,
        location: data.location,
        price: data.price,
        owner_phone: data.ownerPhone,
        operating_company: data.operatingCompany,
        project_sections: data.projectSections,
        images: uploadedImageUrls,
        user_id: user.data.user.id
      });

      if (error) throw error;

      await fetchProperties(); // Refresh the properties list
      toast({
        title: isRTL ? 'تم إضافة العقار بنجاح' : 'Property added successfully',
      });
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: isRTL ? 'حدث خطأ أثناء إضافة العقار' : 'Error adding property',
        variant: "destructive",
      });
    }
  };

  const handleEditProperty = async (data: Property) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: data.title,
          description: data.description,
          type: data.type,
          area: data.area,
          location: data.location,
          price: data.price,
          owner_phone: data.ownerPhone,
          operating_company: data.operatingCompany,
          project_sections: data.projectSections,
          images: data.images,
        })
        .eq('id', data.id);

      if (error) throw error;

      await fetchProperties(); // Refresh the properties list
      toast({
        title: isRTL ? 'تم تحديث العقار بنجاح' : 'Property updated successfully',
      });
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: isRTL ? 'حدث خطأ أثناء تحديث العقار' : 'Error updating property',
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) throw error;

      await fetchProperties(); // Refresh the properties list
      toast({
        title: isRTL ? 'تم حذف العقار بنجاح' : 'Property deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: isRTL ? 'حدث خطأ أثناء حذف العقار' : 'Error deleting property',
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar open={sidebarOpen} />
        <main className={cn(
          "flex-1 p-6 transition-all duration-300 ease-in-out",
          sidebarOpen ? (isRTL ? "mr-64" : "ml-64") : "m-0"
        )}>
          <div className={cn(
            "flex justify-between items-center mb-6",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <h1 className={cn(
              "text-2xl font-semibold",
              isRTL ? "font-cairo" : ""
            )}>{t("properties.title")}</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button className={cn(
                  "gap-2",
                  isRTL ? "flex-row-reverse" : ""
                )}>
                  <Plus className="w-4 h-4" />
                  {t("properties.addProperty")}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={isRTL ? "right" : "left"} 
                className={cn(
                  "w-full sm:max-w-2xl overflow-y-auto",
                  isRTL ? "font-cairo" : ""
                )}
              >
                <SheetHeader>
                  <SheetTitle className={cn(
                    isRTL ? "text-right font-cairo" : ""
                  )}>
                    {t("properties.addProperty")}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <PropertyForm
                    onSubmit={handleAddProperty}
                    onCancel={() => {
                      const sheet = document.querySelector('[data-state="open"]');
                      if (sheet) {
                        const closeButton = sheet.querySelector('button[aria-label="Close"]');
                        if (closeButton) {
                          (closeButton as HTMLButtonElement).click();
                        }
                      }
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <ScrollArea className="h-[calc(100vh-10rem)]">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onEdit={handleEditProperty}
                    onDelete={handleDeleteProperty}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Properties;