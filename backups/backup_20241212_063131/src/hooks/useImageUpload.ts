import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const uploadImages = async (files: File[]): Promise<string[]> => {
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error(isRTL ? 'يجب أن يكون الملف صورة' : 'File must be an image');
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('projects')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error(isRTL ? 'حدث خطأ أثناء رفع الصورة' : 'Error uploading image');
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء رفع الصور' : 'Error uploading images');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImages,
    isUploading
  };
}