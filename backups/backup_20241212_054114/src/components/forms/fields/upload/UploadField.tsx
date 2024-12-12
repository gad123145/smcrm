import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

interface UploadFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  accept: Record<string, string[]>;
  maxFiles: number;
  isRTL?: boolean;
}

export function UploadField({ 
  form, 
  name, 
  label, 
  accept, 
  maxFiles, 
  isRTL = false 
}: UploadFieldProps) {
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const currentUrls = form.getValues(name) || [];
      form.setValue(name, [...currentUrls, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple: maxFiles > 1
  });

  const removeFile = (index: number) => {
    const currentUrls = form.getValues(name) || [];
    form.setValue(
      name,
      currentUrls.filter((_, i) => i !== index)
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
                {field.value.map((url: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
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