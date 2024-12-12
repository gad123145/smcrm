import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { MappingHeader } from "./mapping/MappingHeader";
import { FieldSelect } from "./mapping/FieldSelect";
import { ImportActions } from "./mapping/ImportActions";

interface FieldMappingProps {
  file: File;
  onDataMapped: (data: any[]) => Promise<void>;
}

export function FieldMapping({ file, onDataMapped }: FieldMappingProps) {
  const { t } = useTranslation();
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // All fields are now optional
  const allFields = [
    { key: 'name', label: t('clients.importClients.mapping.fields.name') },
    { key: 'phone', label: t('clients.importClients.mapping.fields.phone') },
    { key: 'email', label: t('clients.importClients.mapping.fields.email') },
    { key: 'facebook', label: t('clients.importClients.mapping.fields.facebook') },
    { key: 'city', label: t('clients.importClients.mapping.fields.city') },
    { key: 'country', label: t('clients.importClients.mapping.fields.country') },
    { key: 'project', label: t('clients.importClients.mapping.fields.project') },
    { key: 'budget', label: t('clients.importClients.mapping.fields.budget') },
    { key: 'salesPerson', label: t('clients.importClients.mapping.fields.salesPerson') },
    { key: 'contactMethod', label: t('clients.importClients.mapping.fields.contactMethod') },
    { key: 'campaign', label: t('clients.importClients.mapping.fields.campaign') }
  ];

  useEffect(() => {
    console.log('Reading file:', file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length > 0) {
          console.log('Headers found:', jsonData[0]);
          setHeaders(jsonData[0] as string[]);
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
        toast.error(t('errors.fileReadError'));
      }
    };
    reader.readAsBinaryString(file);
  }, [file, t]);

  const handleMapping = (field: string, header: string) => {
    console.log('Mapping field:', field, 'to header:', header);
    setMapping(prev => ({ ...prev, [field]: header }));
  };

  const handleImport = async () => {
    // Check if at least one field is mapped
    const hasMappedFields = Object.values(mapping).some(value => value && value !== 'ignore');

    if (!hasMappedFields) {
      toast.error(t('clients.importClients.mapping.atLeastOneRequired'));
      return;
    }

    console.log('Starting import process...');
    setLoading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const mappedData = jsonData.map((row: any) => {
            const mappedRow: any = {
              // Set default values
              country: 'Egypt',
              contactMethod: 'phone',
              status: 'new'
            };

            // Map the selected fields
            Object.entries(mapping).forEach(([field, header]) => {
              if (header && header !== 'ignore') {
                mappedRow[field] = row[header];
              }
            });

            return mappedRow;
          });

          // Filter out completely empty rows
          const validData = mappedData.filter(row => 
            Object.entries(row).some(([key, value]) => 
              key !== 'country' && 
              key !== 'contactMethod' && 
              key !== 'status' && 
              value
            )
          );

          if (validData.length === 0) {
            toast.error(t('clients.importClients.noValidData'));
            return;
          }

          console.log('Valid data for import:', validData);
          await onDataMapped(validData);
        } catch (error) {
          console.error('Error processing Excel data:', error);
          toast.error(t('errors.importProcessingError'));
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error in import process:', error);
      toast.error(t('errors.importFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <MappingHeader />

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">
              {t('clients.importClients.mapping.fields')}
            </h4>
            {allFields.map((field) => (
              <FieldSelect
                key={field.key}
                field={field}
                value={mapping[field.key]}
                headers={headers}
                onChange={(value) => handleMapping(field.key, value)}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <ImportActions
        onImport={handleImport}
        isValid={true}
        loading={loading}
      />
    </div>
  );
}