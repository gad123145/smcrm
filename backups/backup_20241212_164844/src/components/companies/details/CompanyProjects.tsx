import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/lib/storage";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface CompanyProjectsProps {
  companyId: string | undefined;
  isRTL: boolean;
}

export function CompanyProjects({ companyId, isRTL }: CompanyProjectsProps) {
  const { t } = useTranslation();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['company-projects', companyId],
    queryFn: () => {
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      const allProjects = getProjects();
      return allProjects.filter(project => project.company_id === companyId);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          {isRTL ? "حدث خطأ أثناء تحميل المشاريع" : "Error loading projects"}
        </p>
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {isRTL ? "لا توجد مشاريع حالياً" : "No projects yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Project Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={cn(
                    "text-lg font-semibold",
                    isRTL && "font-cairo"
                  )}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className={cn(
                      "text-sm text-muted-foreground mt-1",
                      isRTL && "font-cairo"
                    )}>
                      {project.description}
                    </p>
                  )}
                </div>
                <Badge
                  variant={
                    project.status === 'completed' ? 'default' :
                    project.status === 'in-progress' ? 'secondary' :
                    'outline'
                  }
                  className={cn(isRTL && "font-cairo")}
                >
                  {t(`projects.status.${project.status}`)}
                </Badge>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type */}
                {project.type && (
                  <div>
                    <p className={cn(
                      "text-sm font-medium text-muted-foreground",
                      isRTL && "font-cairo"
                    )}>
                      {t('projects.type')}
                    </p>
                    <p className={cn(
                      "mt-1",
                      isRTL && "font-cairo"
                    )}>
                      {project.type}
                    </p>
                  </div>
                )}

                {/* Manager */}
                {project.manager && (
                  <div>
                    <p className={cn(
                      "text-sm font-medium text-muted-foreground",
                      isRTL && "font-cairo"
                    )}>
                      {t('projects.manager')}
                    </p>
                    <p className={cn(
                      "mt-1",
                      isRTL && "font-cairo"
                    )}>
                      {project.manager}
                    </p>
                  </div>
                )}

                {/* Start Date */}
                {project.start_date && (
                  <div>
                    <p className={cn(
                      "text-sm font-medium text-muted-foreground",
                      isRTL && "font-cairo"
                    )}>
                      {t('projects.startDate')}
                    </p>
                    <p className={cn(
                      "mt-1",
                      isRTL && "font-cairo"
                    )}>
                      {format(new Date(project.start_date), 'PPP', {
                        locale: isRTL ? ar : undefined
                      })}
                    </p>
                  </div>
                )}

                {/* Price */}
                {project.price && (
                  <div>
                    <p className={cn(
                      "text-sm font-medium text-muted-foreground",
                      isRTL && "font-cairo"
                    )}>
                      {t('projects.price')}
                    </p>
                    <p className={cn(
                      "mt-1",
                      isRTL && "font-cairo"
                    )}>
                      {new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
                        style: 'currency',
                        currency: 'SAR'
                      }).format(project.price)}
                    </p>
                  </div>
                )}

                {/* Project Area */}
                {project.project_area && (
                  <div>
                    <p className={cn(
                      "text-sm font-medium text-muted-foreground",
                      isRTL && "font-cairo"
                    )}>
                      {t('projects.projectArea')}
                    </p>
                    <p className={cn(
                      "mt-1",
                      isRTL && "font-cairo"
                    )}>
                      {new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US').format(project.project_area)} m²
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}