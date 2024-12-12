import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilePreviewProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
  type: "image" | "video" | "file";
}

export function FilePreview({ file, index, onRemove, type }: FilePreviewProps) {
  return (
    <div className="relative group">
      {type === "image" ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full h-32 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-32 flex items-center justify-center bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">{file.name}</p>
        </div>
      )}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}