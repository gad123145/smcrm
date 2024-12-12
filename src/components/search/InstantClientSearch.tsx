import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClientStore } from "@/data/clientsData";
import { Client } from "@/data/clientsData";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function InstantClientSearch() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const clients = useClientStore((state) => state.clients);
  const setGlobalSearchQuery = useClientStore((state) => state.setSearchQuery);

  useEffect(() => {
    setGlobalSearchQuery(searchQuery);
  }, [searchQuery, setGlobalSearchQuery]);

  const filteredClients = clients.filter((client) => {
    const searchableFields = [
      client.name,
      client.phone,
      client.email,
      client.facebook,
      client.city,
      client.project,
      client.salesPerson,
      client.country,
      client.budget,
      client.campaign,
      client.contactMethod,
    ].filter(Boolean);

    const query = searchQuery.toLowerCase().trim();
    return searchableFields.some((field) =>
      String(field).toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative w-full md:w-96">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("dashboard.search")}
              className="w-full pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white"
              onClick={() => setOpen(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder={t("dashboard.searchPlaceholder")} />
            <CommandList>
              <CommandEmpty>{t("dashboard.noResults")}</CommandEmpty>
              <CommandGroup>
                {filteredClients.slice(0, 10).map((client: Client) => (
                  <CommandItem
                    key={client.id}
                    onSelect={() => {
                      setSearchQuery(client.name);
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-sm text-gray-500">
                        {client.phone} - {client.email}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}