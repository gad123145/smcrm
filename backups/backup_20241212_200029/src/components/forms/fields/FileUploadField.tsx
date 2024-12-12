import { useTranslation } from "react-i18next";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";

export interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  accept: string;
  maxFiles: number;
  isRTL?: boolean;
  onChange?: (files: File[]) => void;  // Added this line
}

export function FileUploadField({ 
  form, 
  name, 
  label, 
  accept, 
  maxFiles, 
  isRTL = true,
  onChange  // Added this line
}: FileUploadFieldProps) {
  const { t } = useTranslation();

  const onDrop = (acceptedFiles: File[]) => {
    const currentFiles = form.getValues(name) || [];
    form.setValue(name, [...currentFiles, ...acceptedFiles]);
    // Added this line to call onChange if provided
    if (onChange) {
      onChange(acceptedFiles);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: maxFiles > 1
  });

  const removeFile = (index: number) => {
    const currentFiles = form.getValues(name) || [];
    form.setValue(
      name,
      currentFiles.filter((_, i) => i !== index)
    );
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn("text-right", isRTL && "font-cairo")}>
            {label}
          </FormLabel>
          <div className="space-y-4">
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
                {isRTL ? "اسحب وأفلت الصور هنا أو انقر للاختيار" : "Drag and drop images here or click to select"}
              </p>
            </div>

            {field.value && field.value.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {field.value.map((file: File | string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <p className={cn(
              "text-sm text-muted-foreground",
              isRTL && "text-right font-cairo"
            )}>
              {field.value?.length || 0} {isRTL ? "صور تم اختيارها" : "images selected"}
            </p>
          </div>
        </FormItem>
      )}
    />
  );
}