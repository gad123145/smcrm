import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
}

export function FileDropZone({ onFileSelect }: FileDropZoneProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
        "hover:border-primary/50 hover:bg-primary/5",
        isDragActive && "border-primary bg-primary/10",
        isRTL && "font-cairo"
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {t('clients.importClients.dropFiles')}
      </p>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        {t('clients.importClients.maxSize')}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
        {t('clients.importClients.supportedFormats')}
      </p>
    </div>
  );
}