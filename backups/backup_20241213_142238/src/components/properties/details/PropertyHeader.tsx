import { Property } from "@/types/property";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PropertyHeaderProps {
  property: Property;
  isRTL: boolean;
}

export function PropertyHeader({ property, isRTL }: PropertyHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={cn(
      "flex items-center justify-between",
      isRTL && "flex-row-reverse"
    )}>
      <div>
        <h1 className={cn(
          "text-2xl font-semibold mb-2",
          isRTL && "text-right"
        )}>
          {property.title}
        </h1>
        <p className={cn(
          "text-muted-foreground",
          isRTL && "text-right"
        )}>
          {property.location}, {property.city}
        </p>
      </div>
      <Button
        variant="outline"
        className={cn("gap-2", isRTL && "flex-row-reverse")}
        onClick={() => navigate(`/properties/edit/${property.id}`)}
      >
        <Pencil className="w-4 h-4" />
        {isRTL ? "تعديل العقار" : "Edit Property"}
      </Button>
    </div>
  );
}
