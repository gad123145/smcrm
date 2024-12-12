import { supabase } from "@/integrations/supabase/client";

export class ImportLogic {
  async checkDuplicates(data: any[]) {
    // Only get phone numbers that are not empty
    const phones = data.map(row => row.phone).filter(Boolean);
    console.log('Checking duplicates for phones:', phones);

    if (phones.length === 0) return [];

    const { data: existingClients, error } = await supabase
      .from("clients")
      .select('id, name, phone')
      .in('phone', phones);

    if (error) {
      console.error('Error checking duplicates:', error);
      throw error;
    }
    
    console.log('Found existing clients:', existingClients);
    return existingClients || [];
  }

  async importClients(data: any[], userId: string) {
    try {
      console.log('Starting import with data:', data);
      
      // Check for duplicates first
      const duplicates = await this.checkDuplicates(data);
      console.log('Found duplicates:', duplicates);

      // Filter out duplicates by phone number only
      const newClients = data.filter(client => {
        // Skip if client has no phone number
        if (!client.phone) return false;
        
        const isDuplicate = duplicates.some(existing => 
          existing.phone && client.phone && 
          existing.phone.toString() === client.phone.toString()
        );
        
        if (isDuplicate) {
          console.log('Skipping duplicate client:', client.name, 'with phone:', client.phone);
        }
        
        return !isDuplicate;
      });

      console.log('New clients to import:', newClients);

      if (newClients.length === 0) {
        return {
          imported: 0,
          duplicates: duplicates.length,
          duplicatePhones: duplicates.map(d => d.phone),
          total: data.length
        };
      }

      const mappedData = newClients.map((row) => ({
        name: row.name || "",
        phone: row.phone || "",
        country: row.country || "Egypt",
        contact_method: row.contactMethod || "phone",
        email: row.email || null,
        facebook: row.facebook || null,
        city: row.city || null,
        project: row.project || null,
        budget: row.budget || null,
        campaign: row.campaign || null,
        status: "new",
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      console.log('Importing mapped data:', mappedData);

      if (mappedData.length > 0) {
        const { error } = await supabase
          .from("clients")
          .insert(mappedData);

        if (error) {
          console.error("Error importing clients:", error);
          throw error;
        }
      }

      return {
        imported: newClients.length,
        duplicates: duplicates.length,
        duplicatePhones: duplicates.map(d => d.phone),
        total: data.length
      };
    } catch (error) {
      console.error("Error in importClients:", error);
      throw error;
    }
  }
}