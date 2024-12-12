import { ImagePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ImageUploadZoneProps {
  getRootProps: any;
  getInputProps: any;
  isRTL?: boolean;
}

export function ImageUploadZone({ getRootProps, getInputProps, isRTL = false }: ImageUploadZoneProps) {
  const { t } = useTranslation();

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors",
        isRTL && "font-cairo"
      )}
    >
      <input {...getInputProps()} />
      <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        {isRTL 
          ? "اسحب وأفلت الصور هنا أو انقر للاختيار" 
          : "Drag and drop images here or click to select"}
      </p>
    </div>
  );
}