import { MessageCircle, Phone, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContactButtonsProps {
  phone: string;
  facebookId?: string;
}

export function ContactButtons({ phone, facebookId }: ContactButtonsProps) {
  const { t } = useTranslation();

  const openWhatsApp = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const openMessenger = (facebookId: string) => {
    if (facebookId) {
      window.open(`https://m.me/${facebookId}`, '_blank');
    } else {
      toast.error(t('clients.errors.noFacebookId'));
    }
  };

  const openTruecaller = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://www.truecaller.com/search/${formattedPhone}`, '_blank');
  };

  return (
    <div className="flex gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => openWhatsApp(phone)}
              className="hover:opacity-70 transition-opacity"
            >
              <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>WhatsApp</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => openMessenger(facebookId || '')}
              className="hover:opacity-70 transition-opacity"
            >
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Messenger</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => openTruecaller(phone)}
              className="hover:opacity-70 transition-opacity"
            >
              <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Truecaller</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}