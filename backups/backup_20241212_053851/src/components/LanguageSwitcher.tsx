import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-colors duration-200"
          )}
        >
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "end" : "start"}>
        <DropdownMenuItem 
          onClick={() => changeLanguage('ar')}
          className={cn(
            "cursor-pointer",
            i18n.language === 'ar' && "bg-primary/10"
          )}
        >
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={cn(
            "cursor-pointer",
            i18n.language === 'en' && "bg-primary/10"
          )}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};