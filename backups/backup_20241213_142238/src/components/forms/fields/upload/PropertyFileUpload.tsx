import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { ImageUploadZone } from "./ImageUploadZone";
import { FilePreview } from "./FilePreview";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyFileUploadProps {
  onUploadComplete: (urls: { images: string[] }) => void;
  isRTL?: boolean;
}

export function PropertyFileUpload({ onUploadComplete, isRTL = false }: PropertyFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { t } = useTranslation();

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    onUploadComplete({ images: acceptedFiles.map(file => URL.createObjectURL(file)) });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className={cn(
        "font-medium",
        isRTL ? "text-right font-cairo" : ""
      )}>
        {isRTL ? "صور العقار" : "Property Images"}
      </h3>
      
      <ImageUploadZone 
        getRootProps={getRootProps} 
        getInputProps={getInputProps}
        isRTL={isRTL}
      />

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {files.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              index={index}
              onRemove={removeFile}
              type="image"
            />
          ))}
        </div>
      )}
    </div>
  );
}