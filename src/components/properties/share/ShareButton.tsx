import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Property } from "@/types/property";
import { PropertyShareDialog } from "./PropertyShareDialog";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  property: Property;
  isRTL?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

export function ShareButton({ property, isRTL = false, variant = 'outline' }: ShareButtonProps) {
  const { t } = useTranslation();
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setIsShareOpen(true)}
        className={cn(
          "flex items-center gap-2 h-9",
          isRTL && "flex-row-reverse"
        )}
      >
        <Share2 className="h-4 w-4" />
        <span>{isRTL ? "مشاركة" : "Share"}</span>
      </Button>

      <PropertyShareDialog
        property={property}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        isRTL={isRTL}
      />
    </>
  );
}
