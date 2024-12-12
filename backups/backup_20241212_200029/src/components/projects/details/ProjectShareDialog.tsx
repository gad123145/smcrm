import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import { ProjectSharePreview } from './ProjectSharePreview';
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  manager: string;
  start_date: string;
  price: number;
  project_area: number;
  images?: string[];
}

interface ProjectShareDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  isRTL?: boolean;
}

interface ShareField {
  id: keyof Project;
  label: string;
}

export function ProjectShareDialog({ project, isOpen, onClose, isRTL = false }: ProjectShareDialogProps) {
  const { t } = useTranslation();
  const [selectedFields, setSelectedFields] = useState<Array<keyof Project>>([]);

  // Check if project exists
  if (!project) {
    return null;
  }

  const shareFields: ShareField[] = [
    { id: 'name', label: isRTL ? 'اسم المشروع' : 'Project Name' },
    { id: 'description', label: isRTL ? 'الوصف' : 'Description' },
    { id: 'type', label: isRTL ? 'النوع' : 'Type' },
    { id: 'status', label: isRTL ? 'الحالة' : 'Status' },
    { id: 'manager', label: isRTL ? 'مدير المشروع' : 'Project Manager' },
    { id: 'start_date', label: isRTL ? 'تاريخ البدء' : 'Start Date' },
    { id: 'price', label: isRTL ? 'السعر' : 'Price' },
    { id: 'project_area', label: isRTL ? 'المساحة' : 'Area' }
  ];

  // Add images field if project has images
  if (project.images && project.images.length > 0) {
    shareFields.unshift({ 
      id: 'images' as keyof Project, 
      label: isRTL ? 'الصور' : 'Images'
    });
  }

  const handleFieldToggle = (fieldId: keyof Project) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  const formatArea = (area: number) => {
    return `${new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(area)} ${isRTL ? 'م²' : 'm²'}`;
  };

  const getProjectType = (type: string) => {
    const types = {
      residential: { ar: 'سكني', en: 'Residential' },
      commercial: { ar: 'تجاري', en: 'Commercial' },
      industrial: { ar: 'صناعي', en: 'Industrial' },
      infrastructure: { ar: 'بنية تحتية', en: 'Infrastructure' },
      other: { ar: 'أخرى', en: 'Other' }
    };
    return types[type as keyof typeof types]?.[isRTL ? 'ar' : 'en'] || type;
  };

  const getProjectStatus = (status: string) => {
    const statuses = {
      active: { ar: 'نشط', en: 'Active' },
      'on-hold': { ar: 'معلق', en: 'On Hold' },
      completed: { ar: 'مكتمل', en: 'Completed' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' }
    };
    return statuses[status as keyof typeof statuses]?.[isRTL ? 'ar' : 'en'] || status;
  };

  const getFieldValue = (fieldId: keyof Project) => {
    const value = project[fieldId];
    
    switch (fieldId) {
      case 'type':
        return getProjectType(value as string);
      case 'status':
        return getProjectStatus(value as string);
      case 'price':
        return formatCurrency(value as number);
      case 'project_area':
        return formatArea(value as number);
      case 'start_date':
        return format(new Date(value as string), 'PPP', { locale: isRTL ? ar : undefined });
      case 'images':
        return value ? (value as string[]).join('\n') : '';
      default:
        return value;
    }
  };

  const getShareableContent = () => {
    let content = '';
    
    // Add project name as title if selected
    if (selectedFields.includes('name')) {
      content += isRTL 
        ? `${project.name}\n\n`
        : `${project.name}\n\n`;
    }

    // Add description if selected
    if (selectedFields.includes('description')) {
      content += `📝 ${project.description}\n\n`;
    }

    // Add other details with emojis
    const details = selectedFields
      .filter(field => field !== 'name' && field !== 'description' && field !== 'images')
      .map(field => {
        const label = shareFields.find(f => f.id === field)?.label;
        const value = getFieldValue(field);
        const emoji = getFieldEmoji(field);
        return `${emoji} ${label}: ${value}`;
      });

    if (details.length > 0) {
      content += details.join('\n') + '\n\n';
    }

    // Add images if selected
    if (selectedFields.includes('images') && project.images && project.images.length > 0) {
      content += `📸 ${isRTL ? 'صور المشروع' : 'Project Images'}:\n`;
      project.images.forEach((image) => {
        content += `${image}\n`;
      });
    }

    return content.trim();
  };

  const getFieldEmoji = (field: keyof Project): string => {
    const emojis: Record<string, string> = {
      type: '🏗️',
      status: '📊',
      manager: '👤',
      start_date: '📅',
      price: '💰',
      project_area: '📐',
      location: '📍',
      description: '📝'
    };
    return emojis[field] || '•';
  };

  const handleDownload = () => {
    const content = getShareableContent();
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="${isRTL ? 'ar' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
        <head>
          <meta charset="UTF-8">
          <title>${project.name}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              line-height: 1.6;
              color: #333;
              direction: ${isRTL ? 'rtl' : 'ltr'};
            }
            h1 { color: #1a1a1a; margin-bottom: 1rem; }
            .project-details { margin: 2rem 0; }
            .project-images {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 1rem;
              margin: 2rem 0;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .detail-item {
              margin: 1rem 0;
              padding: 0.5rem 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: 600;
              color: #666;
            }
          </style>
        </head>
        <body>
          ${selectedFields.includes('name') ? `<h1>${project.name}</h1>` : ''}
          <div class="project-details">
            ${selectedFields.includes('description') ? `<div class="detail-item">${project.description}</div>` : ''}
            ${selectedFields
              .filter(field => field !== 'name' && field !== 'description' && field !== 'images')
              .map(field => {
                const label = shareFields.find(f => f.id === field)?.label;
                const value = getFieldValue(field);
                return `<div class="detail-item">
                  <span class="detail-label">${label}:</span> ${value}
                </div>`;
              })
              .join('')}
          </div>
          ${selectedFields.includes('images') && project.images && project.images.length > 0 ? `
            <div class="project-images">
              ${project.images.map(img => `<img src="${img}" alt="${project.name}" loading="lazy">`).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-details.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[700px]",
        isRTL ? "font-cairo" : ""
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            isRTL ? "text-right" : ""
          )}>
            {isRTL ? 'مشاركة المشروع' : 'Share Project'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[250px,1fr] gap-6">
          {/* Fields Selection */}
          <div className={cn(
            "py-4",
            isRTL ? "text-right" : ""
          )}>
            <Label className="text-sm font-medium">
              {isRTL ? 'اختر الحقول المراد مشاركتها' : 'Select fields to share'}
            </Label>
            <div className="mt-4 space-y-4">
              {shareFields.map((field) => (
                <div key={field.id} className={cn(
                  "flex items-center space-x-2",
                  isRTL ? "flex-row-reverse space-x-reverse" : ""
                )}>
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => handleFieldToggle(field.id)}
                  />
                  <Label
                    htmlFor={field.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <ProjectSharePreview
              project={project}
              selectedFields={selectedFields}
              isRTL={isRTL}
            />
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-4 justify-end">
            <Button
              variant="outline"
              onClick={handleDownload}
              className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}
            >
              <Download className="w-4 h-4" />
              {isRTL ? 'تنزيل' : 'Download'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
