import { Client } from "@/data/clientsData";
import { ClientInsights } from "../insights/ClientInsights";

interface ClientInsightsTabProps {
  client: Client;
}

export function ClientInsightsTab({ client }: ClientInsightsTabProps) {
  return <ClientInsights client={client} />;
}