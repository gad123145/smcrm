import { useQuery } from "@tanstack/react-query";
import type { Property } from "@/types/property";

const STORAGE_KEY = "properties";

export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) {
          // Initialize with empty array if no data exists
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          return [];
        }
        const parsedData = JSON.parse(storedData) as Property[];
        return Array.isArray(parsedData) ? parsedData : [];
      } catch (error) {
        console.error("Error loading properties:", error);
        return [];
      }
    },
    staleTime: 1000, // 1 second
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};
