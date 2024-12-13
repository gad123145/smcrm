import { TableCell, TableRow } from "@/components/ui/table";
import { Client } from "@/data/clientsData";
import { useTranslation } from "react-i18next";
import { ClientNameCell } from "./details/ClientNameCell";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ContactButtons } from "./contact/ContactButtons";
import { ClientTableActions } from "./table/ClientTableActions";
import { ClientStatusHandler } from "./table/ClientStatusHandler";

interface ClientsTableRowProps {
  client: Client;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => Promise<void>;
}

export function ClientsTableRow({ 
  client, 
  isSelected, 
  onSelect,
  isFavorite = false,
  onToggleFavorite
}: ClientsTableRowProps) {
  const { t } = useTranslation();

  return (
    <TableRow>
      <TableCell>
        <ClientTableActions
          isSelected={isSelected}
          onSelect={onSelect}
          clientId={client.id}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </TableCell>
      <ClientNameCell client={client} />
      <TableCell>
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="cursor-pointer">{client.phone}</span>
          </HoverCardTrigger>
          <HoverCardContent>
            <ContactButtons phone={client.phone} facebookId={client.facebook} />
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>{client.email}</TableCell>
      <TableCell>{client.facebook}</TableCell>
      <TableCell>{client.country || t('clients.common.unknown')}</TableCell>
      <TableCell>{client.city}</TableCell>
      <TableCell>{client.project}</TableCell>
      <TableCell>
        <ClientStatusHandler
          clientId={client.id}
          status={client.status}
          userId={client.userId}
          assignedTo={client.assignedTo}
          clientName={client.name}
        />
      </TableCell>
    </TableRow>
  );
}