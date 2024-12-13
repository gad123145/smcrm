import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImagesProps {
  images: string[];
}

export function PropertyImages({ images }: PropertyImagesProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    // Process and validate images
    const validImages = images?.filter(img => {
      return typeof img === 'string' && (
        img.startsWith('data:image') || 
        img.startsWith('http') || 
        img.startsWith('blob:')
      );
    }) || [];

    console.log('Processing images:', validImages);
    setLoadedImages(validImages);
  }, [images]);

  const handleImageError = (index: number) => {
    console.error(`Image failed to load: ${loadedImages[index]}`);
    // Remove failed image from state
    setLoadedImages(current => current.filter((_, i) => i !== index));
  };

  if (!loadedImages || loadedImages.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
          <p>{isRTL ? "لا توجد صور متاحة" : "No images available"}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadedImages.map((image, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
              <img
                src={image}
                alt={`Property image ${index + 1}`}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                onError={() => handleImageError(index)}
                loading="eager"
                crossOrigin="anonymous"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
