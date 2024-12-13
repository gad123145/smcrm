import { useCallback } from "react";
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
  onRowClick?: (client: Client) => void;
  isLoading?: boolean;
}

export function ClientsListTable({
  clients,
  selectedClients,
  onSelectAll,
  onSelectClient,
  isAllSelected,
  favorites,
  onToggleFavorite,
  onRowClick,
  isLoading,
}: ClientsListTableProps) {
  const handleRowClick = useCallback((client: Client) => {
    if (!isLoading && onRowClick) {
      onRowClick(client);
    }
  }, [isLoading, onRowClick]);

  const handleCheckboxClick = useCallback((e: React.MouseEvent, clientId: string) => {
    e.stopPropagation(); // Prevent row click
    onSelectClient(clientId);
  }, [onSelectClient]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent, clientId: string) => {
    e.stopPropagation(); // Prevent row click
    onToggleFavorite(clientId);
  }, [onToggleFavorite]);

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
            onClick={() => handleRowClick(client)}
            onCheckboxClick={(e) => handleCheckboxClick(e, client.id)}
            onFavoriteClick={(e) => handleFavoriteClick(e, client.id)}
          />
        ))}
      </TableBody>
    </Table>
  );
}