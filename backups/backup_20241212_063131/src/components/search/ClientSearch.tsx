import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useClientStore } from "@/data/clientsData";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function ClientSearch() {
  const { t } = useTranslation();
  const setSearchQuery = useClientStore(state => state.setSearchQuery);
  const [localQuery, setLocalQuery] = useState("");

  useEffect(() => {
    setSearchQuery(localQuery);
  }, [localQuery, setSearchQuery]);

  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder={t("dashboard.search")}
        className="w-full pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
}