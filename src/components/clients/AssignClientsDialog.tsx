import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LocalClientStorage } from "@/lib/localClientStorage";

interface AssignClientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientIds: string[];
  onSuccess: () => void;
}

export function AssignClientsDialog({
  open,
  onOpenChange,
  clientIds,
  onSuccess,
}: AssignClientsDialogProps) {
  const { t, i18n } = useTranslation();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [users, setUsers] = useState<Array<{ id: string; full_name: string; status: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isRTL = i18n.language === 'ar';
  const clientStorage = new LocalClientStorage();

  // Mock users for local storage version
  useEffect(() => {
    if (open) {
      setUsers([
        { id: 'user1', full_name: 'John Doe', status: 'active' },
        { id: 'user2', full_name: 'Jane Smith', status: 'active' },
        { id: 'user3', full_name: 'Bob Johnson', status: 'inactive' }
      ]);
    }
  }, [open]);

  const handleAssign = async () => {
    if (!selectedUser) {
      toast.error(t("errors.selectUser"));
      return;
    }

    setIsLoading(true);
    try {
      const userId = 'local-user';
      await Promise.all(clientIds.map(async (clientId) => {
        const client = await clientStorage.getClient(clientId, userId);
        if (client) {
          client.assigned_to = selectedUser;
          await clientStorage.updateClient(clientId, client, userId);
        }
      }));

      toast.success(t("success.clientsAssigned"));
      onSuccess();
    } catch (error) {
      console.error('Error assigning clients:', error);
      toast.error(t("errors.assignClients"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={`${isRTL ? 'text-right' : 'text-left'} dark:text-white`}>
            {isRTL ? 'تعيين العملاء' : 'Assign Clients'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="user" className={`dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'اختر المستخدم' : 'Select User'}
            </Label>
            <Select
              value={selectedUser}
              onValueChange={setSelectedUser}
            >
              <SelectTrigger id="user" className="dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder={isRTL ? 'اختر مستخدم' : 'Select a user'} />
              </SelectTrigger>
              <SelectContent className="dark:border-gray-600 dark:bg-gray-800">
                {users.map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    className="dark:text-white dark:focus:bg-gray-700 dark:hover:bg-gray-700"
                  >
                    {user.full_name} {user.status === 'inactive' ? `(${t("users.inactive")})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            onClick={handleAssign}
            disabled={isLoading}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
          >
            {isLoading ? (isRTL ? 'جاري التعيين...' : 'Assigning...') : (isRTL ? 'تعيين' : 'Assign')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}