import { useProjectAIAnalysis } from "@/hooks/useProjectAIAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";
import type { Project } from "@/types/project";
import { ProjectAnalysisDisplay } from "./ProjectAnalysisDisplay";

interface ProjectAIAnalysisProps {
  project: Project;
}

export function ProjectAIAnalysis({ project }: ProjectAIAnalysisProps) {
  const { analysis, isLoading, analyzeProject } = useProjectAIAnalysis(project);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          تحليل الذكاء الاصطناعي
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={analyzeProject}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          <span className="mr-2">تحليل</span>
        </Button>
      </CardHeader>
      <CardContent>
        {analysis ? (
          <ProjectAnalysisDisplay analysis={analysis} />
        ) : (
          <p className="text-sm text-muted-foreground">
            اضغط على زر التحليل للحصول على تحليل ذكي لهذا المشروع
          </p>
        )}
      </CardContent>
    </Card>
  );
}