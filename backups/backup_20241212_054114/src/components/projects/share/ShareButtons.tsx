import { Button } from "@/components/ui/button";
import { MessageCircle, Facebook, Mail, Download } from "lucide-react";
import { WhatsappShareButton, FacebookShareButton, EmailShareButton } from "react-share";

interface ShareButtonsProps {
  shareUrl: string;
  shareText: string;
  projectName: string;
  onExport: () => void;
}

export function ShareButtons({ shareUrl, shareText, projectName, onExport }: ShareButtonsProps) {
  return (
    <div className="flex gap-2 justify-center">
      <WhatsappShareButton url="" title={shareText}>
        <Button variant="outline" size="icon">
          <MessageCircle className="h-4 w-4" />
        </Button>
      </WhatsappShareButton>

      <FacebookShareButton url={shareUrl} hashtag={`#${projectName}`}>
        <Button variant="outline" size="icon">
          <Facebook className="h-4 w-4" />
        </Button>
      </FacebookShareButton>

      <EmailShareButton url="" subject={projectName} body={shareText}>
        <Button variant="outline" size="icon">
          <Mail className="h-4 w-4" />
        </Button>
      </EmailShareButton>

      <Button variant="outline" size="icon" onClick={onExport}>
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}