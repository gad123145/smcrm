import { Table, TableBody } from "@/components/ui/table";
import { ClientsTableHeader } from "../ClientsTableHeader";
import { ClientsTableRow } from "../ClientsTableRow";
import { Client } from "@/data/clientsData";

export interface ClientsListTableProps {
  clients: Client[];
  selectedClients: string[];
  onSelectAll: () => void;
  onSelectClient: (id: string) => void;
  isAllSelected: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => Promise<void>;
}

export function ClientsListTable({
  clients,
  selectedClients,
  onSelectAll,
  onSelectClient,
  isAllSelected,
  favorites,
  onToggleFavorite,
}: ClientsListTableProps) {
  return (
    <Table>
      <ClientsTableHeader
        onSelectAll={onSelectAll}
        isAllSelected={isAllSelected}
      />
      <TableBody>
        {clients.map((client) => (
          <ClientsTableRow
            key={client.id}
            client={client}
            isSelected={selectedClients.includes(client.id)}
            onSelect={onSelectClient}
            isFavorite={favorites.includes(client.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </TableBody>
    </Table>
  );
}