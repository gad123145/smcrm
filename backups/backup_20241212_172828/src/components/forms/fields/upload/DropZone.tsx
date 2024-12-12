import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface DropZoneProps {
  getRootProps: any;
  getInputProps: any;
  label?: string;
  description?: string;
}

export function DropZone({ getRootProps, getInputProps, label, description }: DropZoneProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        "hover:border-primary"
      )}
    >
      <input {...getInputProps()} />
      <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {label || (isRTL ? 'اسحب وأفلت الملفات هنا' : 'Drag and drop files here')}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        {description || (isRTL ? 'الصيغ المدعومة: صور، فيديو، PDF، Word' : 'Supported formats: Images, Video, PDF, Word')}
      </p>
      <Button type="button" variant="outline" size="sm" className="mt-4">
        {isRTL ? 'تصفح الملفات' : 'Browse Files'}
      </Button>
    </div>
  );
}