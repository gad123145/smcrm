import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  description?: string;
  images?: string[];
  className?: string;
}

export const ShareButton = ({
  title,
  description,
  images,
  className,
}: ShareButtonProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleShare = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(
          isRTL 
            ? 'تم نسخ الرابط إلى الحافظة' 
            : 'Link copied to clipboard'
        );
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error(
        isRTL 
          ? 'حدث خطأ أثناء المشاركة' 
          : 'Error sharing'
      );
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("w-full", className)}
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
      {isRTL ? 'مشاركة العقار' : 'Share Property'}
    </Button>
  );
};
