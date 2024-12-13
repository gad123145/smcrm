import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Share2, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PropertyShareDialogProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  isRTL?: boolean;
}

export function PropertyShareDialog({ property, isOpen, onClose, isRTL = false }: PropertyShareDialogProps) {
  const { t } = useTranslation();
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "title",
    "description",
    "type",
    "price",
    "area",
    "location",
    "city",
    "images"
  ]);

  const fields = [
    { id: "images", label: isRTL ? "صور العقار" : "Property Images" },
    { id: "title", label: isRTL ? "عنوان العقار" : "Property Title" },
    { id: "description", label: isRTL ? "الوصف" : "Description" },
    { id: "type", label: isRTL ? "النوع" : "Type" },
    { id: "price", label: isRTL ? "السعر" : "Price" },
    { id: "area", label: isRTL ? "المساحة" : "Area" },
    { id: "location", label: isRTL ? "الموقع" : "Location" },
    { id: "city", label: isRTL ? "المدينة" : "City" },
    { id: "features", label: isRTL ? "المميزات" : "Features" },
    { id: "ownerName", label: isRTL ? "اسم المالك" : "Owner Name" },
    { id: "ownerPhone", label: isRTL ? "رقم هاتف المالك" : "Owner Phone" },
  ];

  const handleExportPDF = async () => {
    if (!previewRef.current) {
      toast.error(isRTL ? "حدث خطأ أثناء التصدير" : "Error during export");
      return;
    }

    const loadingToast = toast.loading(isRTL ? "جاري إعداد الملف..." : "Preparing file...");

    try {
      // Convert all images to base64 first
      if (selectedFields.includes("images") && property.images) {
        const convertedImages = await Promise.all(
          property.images.map(async (imgSrc) => {
            try {
              const response = await fetch(imgSrc);
              const blob = await response.blob();
              return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error('Error converting image:', error);
              return null;
            }
          })
        );

        // Update property with base64 images
        const validImages = convertedImages.filter((img): img is string => img !== null);
        // setProperty({ ...property, images: validImages }); // This line is commented out because setProperty is not defined in this scope
      }

      // Wait for DOM to update with new image sources
      await new Promise(resolve => setTimeout(resolve, 1000));

      const element = previewRef.current;
      
      // Set styles for PDF generation
      const originalStyles = {
        width: element.style.width,
        height: element.style.height,
        padding: element.style.padding,
        background: element.style.background
      };

      element.style.width = '800px';
      element.style.height = 'auto';
      element.style.padding = '20px';
      element.style.background = 'white';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        imageTimeout: 30000, // Increased timeout
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('property-preview');
          if (clonedElement) {
            clonedElement.style.width = '800px';
            clonedElement.style.height = 'auto';
            clonedElement.style.padding = '20px';
            clonedElement.style.background = 'white';
            
            // Ensure images are visible in the clone
            const images = clonedElement.getElementsByTagName('img');
            Array.from(images).forEach(img => {
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.display = 'block';
            });
          }
        }
      });

      // Restore original styles
      element.style.width = originalStyles.width;
      element.style.height = originalStyles.height;
      element.style.padding = originalStyles.padding;
      element.style.background = originalStyles.background;

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio, '', 'FAST');
      
      const date = new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US');
      pdf.save(`${property.title}_${date}.pdf`);
      
      toast.dismiss(loadingToast);
      toast.success(isRTL ? "تم تصدير الملف بنجاح" : "File exported successfully");
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.dismiss(loadingToast);
      toast.error(isRTL ? "حدث خطأ أثناء التصدير" : "Error during export");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-md max-h-[90vh]",
        isRTL && "font-cairo"
      )}>
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : ""}>
            {isRTL ? "مشاركة العقار" : "Share Property"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="space-y-4 px-1">
            <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
              <h4 className="font-medium">
                {isRTL ? "اختر الحقول المراد مشاركتها" : "Select fields to share"}
              </h4>
              {fields.map((field) => (
                <div key={field.id} className={cn(
                  "flex items-center gap-2",
                  isRTL && "flex-row-reverse"
                )}>
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
                  <label htmlFor={field.id} className="text-sm">
                    {field.label}
                  </label>
                </div>
              ))}
            </div>

            <div ref={previewRef} id="property-preview" className="mt-4">
              <div className="space-y-4">
                {selectedFields.includes("title") && (
                  <div>
                    <h2 className="text-xl font-semibold">{property.title}</h2>
                  </div>
                )}
                
                {selectedFields.includes("type") && (
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? "النوع" : "Type"}</p>
                    <p>{property.type}</p>
                  </div>
                )}

                {selectedFields.includes("price") && (
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? "السعر" : "Price"}</p>
                    <p>{property.price}</p>
                  </div>
                )}

                {selectedFields.includes("area") && (
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? "المساحة" : "Area"}</p>
                    <p>{property.area} m²</p>
                  </div>
                )}

                {selectedFields.includes("location") && (
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? "الموقع" : "Location"}</p>
                    <p>{property.location}</p>
                  </div>
                )}

                {selectedFields.includes("city") && (
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? "المدينة" : "City"}</p>
                    <p>{property.city}</p>
                  </div>
                )}

                {selectedFields.includes("description") && (
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? "الوصف" : "Description"}</p>
                    <p>{property.description}</p>
                  </div>
                )}

                {selectedFields.includes("features") && property.features && (
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? "المميزات" : "Features"}</p>
                    <ul className="list-disc list-inside">
                      {property.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedFields.includes("images") && property.images && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{isRTL ? "الصور" : "Images"}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {property.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${property.title} - ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                          crossOrigin="anonymous"
                          loading="eager"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-4 sticky bottom-0 bg-background py-4 border-t">
              <Button onClick={handleExportPDF} className="gap-2">
                <Download className="w-4 h-4" />
                {isRTL ? "تصدير PDF" : "Export PDF"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
