import { supabase } from './supabaseClient';
import { getCompanies, saveCompanies } from './localStorage/companies';
import { getProjects, saveProjects } from './localStorage/projects';

export class SupabaseCompanySync {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async syncCompaniesToCloud() {
    try {
      const localCompanies = getCompanies();
      
      for (const company of localCompanies) {
        const { error } = await supabase
          .from('companies')
          .upsert({
            id: company.id,
            name: company.name,
            description: company.description,
            location: company.location,
            contact_info: company.contact_info,
            user_id: this.userId,
            last_synced: new Date().toISOString()
          });

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error syncing companies to cloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncProjectsToCloud() {
    try {
      const localProjects = getProjects();
      
      for (const project of localProjects) {
        const { error } = await supabase
          .from('projects')
          .upsert({
            id: project.id,
            name: project.name,
            description: project.description,
            location: project.location,
            price: project.price,
            operating_company: project.operating_company,
            company_id: project.company_id,
            user_id: this.userId,
            last_synced: new Date().toISOString()
          });

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error syncing projects to cloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncCompaniesFromCloud() {
    try {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', this.userId);

      if (error) throw error;

      if (companies) {
        saveCompanies(companies);
      }

      return { success: true };
    } catch (error) {
      console.error('Error syncing companies from cloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncProjectsFromCloud() {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', this.userId);

      if (error) throw error;

      if (projects) {
        saveProjects(projects);
      }

      return { success: true };
    } catch (error) {
      console.error('Error syncing projects from cloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncAll() {
    try {
      // Sync to cloud first
      await this.syncCompaniesToCloud();
      await this.syncProjectsToCloud();

      // Then sync from cloud
      await this.syncCompaniesFromCloud();
      await this.syncProjectsFromCloud();

      return { success: true };
    } catch (error) {
      console.error('Error in full sync:', error);
      return { success: false, message: error.message };
    }
  }
}
