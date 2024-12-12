import { read, utils } from "xlsx";
import { z } from "zod";
import { formSchema } from "@/components/forms/formSchema";

export type ClientField = keyof z.infer<typeof formSchema>;

export const processExcelFile = async (file: File): Promise<{ data: any[]; columns: string[] }> => {
  console.log('Processing Excel file:', file.name);
  const data = await file.arrayBuffer();
  const workbook = read(data);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = utils.sheet_to_json(worksheet);
  const columns = Object.keys(jsonData[0] || {});
  
  console.log('Excel processing complete:', {
    sheets: workbook.SheetNames,
    rowCount: jsonData.length,
    columns
  });
  
  return { data: jsonData, columns };
};

export const validateRequiredFields = (mappings: Record<ClientField, string>) => {
  const requiredFields = ["name", "phone"] as const;
  const missingFields = requiredFields.filter(field => !mappings[field] || mappings[field] === "ignore");
  
  console.log('Validating required fields:', {
    mappings,
    missingFields
  });
  
  return missingFields;
};

export const prepareClientData = (row: any, mappings: Record<ClientField, string>) => {
  console.log('Preparing client data for row:', row);
  const clientData: any = {};

  // Map only the fields that are present in the mappings
  Object.entries(mappings).forEach(([field, column]) => {
    if (column && column !== "ignore" && row[column] !== undefined) {
      clientData[field] = String(row[column]).trim();
    }
  });

  console.log('Prepared client data:', clientData);
  return clientData;
};

export const isValidClientData = (clientData: any): boolean => {
  const requiredFields = ["name", "phone"];
  const isValid = requiredFields.every(field => {
    const hasField = clientData[field] && 
                    typeof clientData[field] === "string" && 
                    clientData[field].trim() !== "";
    
    if (!hasField) {
      console.warn(`Invalid/missing required field: ${field}`, clientData[field]);
    }
    
    return hasField;
  });

  console.log('Client data validation:', {
    data: clientData,
    isValid,
    requiredFields
  });
  
  return isValid;
};