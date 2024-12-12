import { User } from "@/types/user";
import { Table, TableBody } from "@/components/ui/table";
import { UserTableHeader } from "./table/UserTableHeader";
import { UserTableRow } from "./table/UserTableRow";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  isAdmin: boolean;
  isRTL: boolean;
  getRoleLabel: (role: string | null) => string;
  getStatusLabel: (status: string | null) => string;
  refetch: () => void;
}

export function UsersTable({ 
  users, 
  isLoading,
  isAdmin,
  isRTL,
  getRoleLabel,
  getStatusLabel,
  refetch 
}: UsersTableProps) {
  if (isLoading) {
    return <div>{isRTL ? "جاري التحميل..." : "Loading..."}</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <UserTableHeader isRTL={isRTL} />
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              isAdmin={isAdmin}
              isRTL={isRTL}
              getRoleLabel={getRoleLabel}
              getStatusLabel={getStatusLabel}
              refetch={refetch}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}