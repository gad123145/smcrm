import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { User, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ClientAssignmentInfoProps {
  assignedTo?: string;
  userId: string;
  clientId: string;
}

export function ClientAssignmentInfo({ assignedTo, userId, clientId }: ClientAssignmentInfoProps) {
  const [assignedUser, setAssignedUser] = useState<string>("");
  const [creator, setCreator] = useState<string>("");
  const [isUnassigning, setIsUnassigning] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch assigned user's name if client is assigned
        if (assignedTo) {
          const { data: assignedProfile, error: assignedError } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', assignedTo)
            .maybeSingle();
          
          if (assignedError) throw assignedError;
          
          if (assignedProfile) {
            setAssignedUser(assignedProfile.full_name || t('clients.common.unnamed'));
          }
        }

        // Fetch creator's name and role
        const { data: creatorProfile, error: creatorError } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', userId)
          .maybeSingle();
        
        if (creatorError) throw creatorError;
        
        if (creatorProfile) {
          setCreator(`${creatorProfile.full_name || t('clients.common.unnamed')} (${t(`clients.roles.${creatorProfile.role}`)})`)
        }
      } catch (error: any) {
        console.error('Error fetching user details:', error);
        toast.error(t("errors.fetchUserError"));
      }
    };

    fetchUsers();
  }, [assignedTo, userId, t]);

  const handleUnassign = async () => {
    try {
      setIsUnassigning(true);
      const { error } = await supabase
        .from('clients')
        .update({ assigned_to: null })
        .eq('id', clientId);

      if (error) throw error;

      toast.success(t("clients.unassignSuccess"));
    } catch (error: any) {
      console.error('Error unassigning client:', error);
      toast.error(t("clients.unassignError"));
    } finally {
      setIsUnassigning(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 text-xs">
      {assignedTo && (
        <Badge variant="outline" className="gap-1 justify-end">
          <User className="h-3 w-3" />
          <span className="text-muted-foreground">{t("clients.assignedTo")}:</span>
          <span>{assignedUser}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 p-0 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleUnassign}
            disabled={isUnassigning}
          >
            <UserMinus className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      <Badge variant="secondary" className="gap-1 justify-end">
        <User className="h-3 w-3" />
        <span className="text-muted-foreground">{t("clients.creator")}:</span>
        <span>{creator}</span>
      </Badge>
    </div>
  );
}