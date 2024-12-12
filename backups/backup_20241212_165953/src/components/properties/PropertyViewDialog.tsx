import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@/components/forms/propertySchema";
import { PropertyViewFields } from "@/components/forms/fields/PropertyViewFields";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface PropertyViewDialogProps {
  property: Property;
}

export function PropertyViewDialog({ property }: PropertyViewDialogProps) {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "title",
    "description",
    "location",
    "price",
    "area",
    "images",
    "operatingCompany"
  ]);

  const fields = [
    { id: "title", label: isRTL ? "العنوان" : "Title" },
    { id: "description", label: isRTL ? "الوصف" : "Description" },
    { id: "location", label: isRTL ? "الموقع" : "Location" },
    { id: "price", label: isRTL ? "السعر" : "Price" },
    { id: "area", label: isRTL ? "المساحة" : "Area" },
    { id: "operatingCompany", label: isRTL ? "شركة الإدارة والتشغيل" : "Operating Company" },
    { id: "images", label: isRTL ? "الصور" : "Images" },
  ];

  const handleExportWebPage = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="${i18n.language}" dir="${isRTL ? 'rtl' : 'ltr'}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${property.title || ''}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              direction: ${isRTL ? 'rtl' : 'ltr'};
              background-color: #f8f9fa;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .images-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 1rem;
              margin: 1rem 0;
            }
            img {
              width: 100%;
              height: 200px;
              object-fit: cover;
              border-radius: 8px;
            }
            .property-details {
              margin-top: 20px;
            }
            .detail-item {
              margin: 10px 0;
              padding: 10px;
              background: #f8f9fa;
              border-radius: 4px;
            }
            h1 {
              color: #333;
              margin-bottom: 1rem;
            }
            .detail-label {
              font-weight: bold;
              color: #666;
            }
            .detail-value {
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${selectedFields.includes('title') ? `<h1>${property.title || ''}</h1>` : ''}
            
            ${selectedFields.includes('images') && property.images && property.images.length > 0 ? `
              <div class="images-grid">
                ${property.images.map((img, index) => `
                  <img 
                    src="${typeof img === 'string' ? img : URL.createObjectURL(img)}" 
                    alt="${property.title || ''} - ${isRTL ? 'صورة' : 'Image'} ${index + 1}"
                  />
                `).join('')}
              </div>
            ` : ''}

            <div class="property-details">
              ${selectedFields.includes('description') && property.description ? `
                <div class="detail-item">
                  <div class="detail-label">${isRTL ? 'الوصف' : 'Description'}</div>
                  <div class="detail-value">${property.description}</div>
                </div>
              ` : ''}

              ${selectedFields.includes('location') && property.location ? `
                <div class="detail-item">
                  <div class="detail-label">${isRTL ? 'الموقع' : 'Location'}</div>
                  <div class="detail-value">${property.location}</div>
                </div>
              ` : ''}

              ${selectedFields.includes('price') && property.price ? `
                <div class="detail-item">
                  <div class="detail-label">${isRTL ? 'السعر' : 'Price'}</div>
                  <div class="detail-value">${property.price}</div>
                </div>
              ` : ''}

              ${selectedFields.includes('area') && property.area ? `
                <div class="detail-item">
                  <div class="detail-label">${isRTL ? 'المساحة' : 'Area'}</div>
                  <div class="detail-value">${property.area}</div>
                </div>
              ` : ''}

              ${selectedFields.includes('operatingCompany') && property.operatingCompany ? `
                <div class="detail-item">
                  <div class="detail-label">${isRTL ? 'شركة الإدارة والتشغيل' : 'Operating Company'}</div>
                  <div class="detail-value">${property.operatingCompany}</div>
                </div>
              ` : ''}
            </div>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${property.title || 'property'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "max-w-4xl max-h-[90vh]",
        isRTL ? "font-cairo" : ""
      )}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className={isRTL ? "text-right" : ""}>
            {property.title}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleExportWebPage}
              title={isRTL ? "تصدير كصفحة ويب" : "Export as webpage"}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mb-4">
          <h4 className={cn(
            "font-medium mb-2",
            isRTL ? "text-right" : ""
          )}>
            {isRTL ? "اختر الحقول المراد تصديرها" : "Select fields to export"}
          </h4>
          <div className={cn(
            "grid grid-cols-2 gap-2",
            isRTL ? "text-right" : ""
          )}>
            {fields.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={selectedFields.includes(field.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFields([...selectedFields, field.id]);
                    } else {
                      setSelectedFields(selectedFields.filter(id => id !== field.id));
                    }
                  }}
                />
                <label 
                  htmlFor={field.id} 
                  className={cn(
                    "text-sm",
                    isRTL ? "mr-2" : "ml-2"
                  )}
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[calc(90vh-8rem)]">
          <PropertyViewFields 
            property={property} 
            isRTL={isRTL} 
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}