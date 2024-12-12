import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
  isRTL?: boolean;
}

export function ImagePreview({ src, onRemove, isRTL = false }: ImagePreviewProps) {
  return (
    <div className="relative group">
      <img
        src={src}
        alt="Preview"
        className="w-full h-32 object-cover rounded-lg"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className={cn(
          "absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity",
          isRTL ? "left-2" : "right-2"
        )}
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}