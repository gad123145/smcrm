import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ClientsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedUser: string | null;
  onUserChange: (value: string | null) => void;
  showFavorites: boolean;
  onFavoritesChange: (value: boolean) => void;
}

export function ClientsFilters({
  searchQuery,
  onSearchChange,
  selectedUser,
  onUserChange,
  showFavorites,
  onFavoritesChange
}: ClientsFiltersProps) {
  const { t } = useTranslation();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder={t('clients.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="show-favorites"
            checked={showFavorites}
            onCheckedChange={onFavoritesChange}
          />
          <Label htmlFor="show-favorites">{t('clients.showFavorites')}</Label>
        </div>

        <Select
          value={selectedUser || "all"}
          onValueChange={(value) => onUserChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('clients.selectUser')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('clients.allUsers')}</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.full_name || user.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}