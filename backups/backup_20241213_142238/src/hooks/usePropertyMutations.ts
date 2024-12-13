import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Property } from "@/types/property";
import { generateId } from "@/lib/utils/id";

const STORAGE_KEY = "properties";

// Add some sample properties if none exist
const initializeProperties = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    const sampleProperties: Property[] = [
      {
        id: generateId(),
        title: "Modern Villa",
        description: "Beautiful modern villa with garden",
        type: "villa",
        price: 500000,
        area: 350,
        location: "Palm Hills",
        city: "Cairo",
        status: "available",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: "Luxury Apartment",
        description: "Spacious luxury apartment with sea view",
        type: "apartment",
        price: 300000,
        area: 200,
        location: "Marina",
        city: "Alexandria",
        status: "available",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProperties));
  }
};

// Initialize properties on module load
initializeProperties();

const getProperties = (): Property[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  return JSON.parse(storedData);
};

const saveProperties = (properties: Property[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
};

export const usePropertyMutations = () => {
  const queryClient = useQueryClient();

  const addProperty = useMutation({
    mutationFn: async (property: Property) => {
      const properties = getProperties();
      const newProperty = {
        ...property,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      properties.push(newProperty);
      saveProperties(properties);
      return newProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const updateProperty = useMutation({
    mutationFn: async (property: Property) => {
      const properties = getProperties();
      const index = properties.findIndex((p) => p.id === property.id);
      if (index === -1) throw new Error("Property not found");
      
      const updatedProperty = {
        ...property,
        updated_at: new Date().toISOString(),
      };
      properties[index] = updatedProperty;
      saveProperties(properties);
      return updatedProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (propertyId: string) => {
      const properties = getProperties();
      const filteredProperties = properties.filter((p) => p.id !== propertyId);
      saveProperties(filteredProperties);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  return {
    addProperty,
    updateProperty,
    deleteProperty,
  };
};
