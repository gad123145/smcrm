import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePermissions() {
  const { data: permissions = [] } = useQuery({
    queryKey: ['userPermissions'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from('user_permissions')
        .select('permission_key')
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data.map(p => p.permission_key);
    },
  });

  const hasPermission = (requiredPermission: string) => {
    return permissions.includes(requiredPermission);
  };

  return {
    permissions,
    hasPermission,
  };
}