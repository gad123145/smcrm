import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectShareDialog } from './details/ProjectShareDialog';
import type { Project } from '@/types/project';

interface ShareButtonProps {
  project: Project;
  isRTL?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export function ShareButton({ project, isRTL = false, variant = 'outline' }: ShareButtonProps) {
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
        <span>{t("projects.share.title")}</span>
      </Button>

      <ProjectShareDialog
        project={project}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        isRTL={isRTL}
      />
    </>
  );
}
