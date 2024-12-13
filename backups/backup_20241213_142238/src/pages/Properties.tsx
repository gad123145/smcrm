import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  area: number;
  location: string;
  city: string;
  status?: string;
}

export default function Properties() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';

  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem('properties');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading properties:', error);
      return [];
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('properties.messages.deleteConfirm'))) {
      try {
        const newProperties = properties.filter(p => p.id !== id);
        localStorage.setItem('properties', JSON.stringify(newProperties));
        setProperties(newProperties);
        toast.success(t('properties.messages.deleteSuccess'));
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error(t('properties.messages.deleteError'));
      }
    }
  };

  return (
    <div className="relative flex min-h-screen">
      <DashboardSidebar open={open} setOpen={setOpen}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {t('properties.menu.overview')}
            </h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/properties')}
              >
                {t('properties.menu.all')}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/properties/residential')}
              >
                {t('properties.menu.residential')}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/properties/commercial')}
              >
                {t('properties.menu.commercial')}
              </Button>
            </div>
          </div>
        </div>
      </DashboardSidebar>

      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardContent>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">{t('properties.title')}</h2>
              <div className="flex items-center space-x-2">
                <Button onClick={() => navigate('/properties/add')}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('properties.addProperty')}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  {t('properties.messages.noProperties')}
                </div>
              ) : (
                properties.map((property) => (
                  <Card 
                    key={property.id}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{property.title}</h3>
                        <div className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/properties/${property.id}/edit`);
                            }}
                          >
                            {t('properties.actions.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(property.id);
                            }}
                          >
                            {t('properties.actions.delete')}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            {t('properties.form.type')}
                          </span>
                          <span>{property.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            {t('properties.form.price')}
                          </span>
                          <span>${property.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            {t('properties.form.location')}
                          </span>
                          <span>{property.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            {t('properties.form.area')}
                          </span>
                          <span>{property.area} m²</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </DashboardContent>
      </DashboardLayout>
    </div>
  );
}