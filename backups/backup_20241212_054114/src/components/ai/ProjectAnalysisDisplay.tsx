import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProjectAnalysisDisplayProps {
  analysis: {
    investmentScore: number;
    marketTrends: string[];
    recommendations: string[];
    socialPost: string;
  };
}

export function ProjectAnalysisDisplay({ analysis }: ProjectAnalysisDisplayProps) {
  const handleShareToSocial = () => {
    if (!analysis?.socialPost) return;
    
    if (navigator.share) {
      navigator.share({
        title: "Project Analysis",
        text: analysis.socialPost
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(analysis.socialPost)
        .then(() => toast.success('تم نسخ النص للحافظة'))
        .catch(() => toast.error('فشل نسخ النص'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">جاذبية الاستثمار:</span>
        <Badge 
          variant={
            analysis.investmentScore > 70 ? "default" : 
            analysis.investmentScore > 40 ? "secondary" : 
            "destructive"
          }
        >
          {analysis.investmentScore}%
        </Badge>
      </div>
      
      <div>
        <span className="text-sm font-medium">اتجاهات السوق:</span>
        <ul className="mt-1 space-y-1">
          {analysis.marketTrends.map((trend, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              • {trend}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <span className="text-sm font-medium">التوصيات:</span>
        <ul className="mt-1 space-y-1">
          {analysis.recommendations.map((rec, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              • {rec}
            </li>
          ))}
        </ul>
      </div>

      {analysis.socialPost && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">منشور مقترح:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShareToSocial}
            >
              <Share2 className="h-4 w-4 ml-2" />
              مشاركة
            </Button>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {analysis.socialPost}
          </p>
        </div>
      )}
    </div>
  );
}