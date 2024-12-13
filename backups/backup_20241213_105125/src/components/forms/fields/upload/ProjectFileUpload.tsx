import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "./ImagePreview";
import { ImageUploadZone } from "./ImageUploadZone";
import { useImageUpload } from "@/hooks/useImageUpload";
import { cn } from "@/lib/utils";

interface ProjectFileUploadProps {
  onUploadComplete: (urls: { images: string[], videos: string[], files: string[] }) => void;
  isRTL?: boolean;
}

export function ProjectFileUpload({ onUploadComplete, isRTL = true }: ProjectFileUploadProps) {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadImages, isUploading } = useImageUpload();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles) => {
      setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    const uploadedUrls = await uploadImages(selectedFiles);
    
    if (uploadedUrls.length > 0) {
      onUploadComplete({
        images: uploadedUrls,
        videos: [],
        files: []
      });
      setSelectedFiles([]);
    }
  };

  return (
    <div className="space-y-4">
      <ImageUploadZone
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isRTL={isRTL}
      />

      {selectedFiles.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <ImagePreview
                key={index}
                src={URL.createObjectURL(file)}
                onRemove={() => removeFile(index)}
                isRTL={isRTL}
              />
            ))}
          </div>

          <Button 
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading 
              ? (isRTL ? 'جاري الرفع...' : 'Uploading...') 
              : (isRTL ? 'رفع الصور' : 'Upload Images')}
          </Button>
        </>
      )}
    </div>
  );
}