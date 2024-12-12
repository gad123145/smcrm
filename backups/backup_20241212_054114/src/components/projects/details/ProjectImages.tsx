import { useTranslation } from "react-i18next";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselPrevious,
  CarouselNext 
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface ProjectImagesProps {
  images?: string[];
  isRTL?: boolean;
}

export function ProjectImages({ images, isRTL = false }: ProjectImagesProps) {
  const { t } = useTranslation();

  if (!images?.length) {
    return (
      <div className={cn(
        "text-muted-foreground text-sm",
        isRTL ? "text-right" : "text-left"
      )}>
        {t("projects.noImages")}
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index}>
              <AspectRatio ratio={16 / 9}>
                <img
                  src={img}
                  alt={`Project Image ${index + 1}`}
                  className="rounded-lg object-cover w-full h-full"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={cn(
          "absolute -left-2 md:-left-4",
          "top-1/2 -translate-y-1/2"
        )} />
        <CarouselNext className={cn(
          "absolute -right-2 md:-right-4",
          "top-1/2 -translate-y-1/2"
        )} />
      </Carousel>
    </div>
  );
}