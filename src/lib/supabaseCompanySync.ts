import { supabase } from '@/integrations/supabase/client';
import type { Company, Project } from '@/types';

export class SupabaseCompanySync {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private async getLocalCompanies(): Promise<Company[]> {
    try {
      const companiesJson = localStorage.getItem('companies');
      return companiesJson ? JSON.parse(companiesJson) : [];
    } catch (error) {
      console.error('Error getting local companies:', error);
      return [];
    }
  }

  private async saveLocalCompanies(companies: Company[]) {
    try {
      localStorage.setItem('companies', JSON.stringify(companies));
    } catch (error) {
      console.error('Error saving local companies:', error);
      throw error;
    }
  }

  private async getLocalProjects(): Promise<Project[]> {
    try {
      const projectsJson = localStorage.getItem('projects');
      return projectsJson ? JSON.parse(projectsJson) : [];
    } catch (error) {
      console.error('Error getting local projects:', error);
      return [];
    }
  }

  private async saveLocalProjects(projects: Project[]) {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving local projects:', error);
      throw error;
    }
  }

  async syncCompaniesToCloud() {
    try {
      console.log('Starting companies sync to cloud...');
      const localCompanies = await this.getLocalCompanies();
      
      if (!localCompanies.length) {
        console.log('No local companies to sync');
        return { success: true };
      }

      const { error } = await supabase
        .from('companies')
        .upsert(
          localCompanies.map(company => ({
            ...company,
            user_id: this.userId,
            last_synced: new Date().toISOString()
          }))
        );

      if (error) {
        console.error('Error syncing companies to cloud:', error);
        throw error;
      }

      console.log('Successfully synced companies to cloud');
      return { success: true };
    } catch (error: any) {
      console.error('Error in syncCompaniesToCloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncProjectsToCloud() {
    try {
      console.log('Starting projects sync to cloud...');
      const localProjects = await this.getLocalProjects();
      
      if (!localProjects.length) {
        console.log('No local projects to sync');
        return { success: true };
      }

      const { error } = await supabase
        .from('projects')
        .upsert(
          localProjects.map(project => ({
            ...project,
            user_id: this.userId,
            last_synced: new Date().toISOString()
          }))
        );

      if (error) {
        console.error('Error syncing projects to cloud:', error);
        throw error;
      }

      console.log('Successfully synced projects to cloud');
      return { success: true };
    } catch (error: any) {
      console.error('Error in syncProjectsToCloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncCompaniesFromCloud() {
    try {
      console.log('Starting companies sync from cloud...');
      const { data: cloudCompanies, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies from cloud:', error);
        throw error;
      }

      if (!cloudCompanies) {
        console.log('No cloud companies found');
        return { success: true };
      }

      await this.saveLocalCompanies(cloudCompanies);
      console.log('Successfully synced companies from cloud');
      return { success: true };
    } catch (error: any) {
      console.error('Error in syncCompaniesFromCloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncProjectsFromCloud() {
    try {
      console.log('Starting projects sync from cloud...');
      const { data: cloudProjects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects from cloud:', error);
        throw error;
      }

      if (!cloudProjects) {
        console.log('No cloud projects found');
        return { success: true };
      }

      await this.saveLocalProjects(cloudProjects);
      console.log('Successfully synced projects from cloud');
      return { success: true };
    } catch (error: any) {
      console.error('Error in syncProjectsFromCloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncAll() {
    try {
      console.log('Starting full sync...');
      
      // Sync to cloud first
      const companiesUpResult = await this.syncCompaniesToCloud();
      if (!companiesUpResult.success) {
        throw new Error('Companies upload failed: ' + companiesUpResult.message);
      }

      const projectsUpResult = await this.syncProjectsToCloud();
      if (!projectsUpResult.success) {
        throw new Error('Projects upload failed: ' + projectsUpResult.message);
      }

      // Then sync from cloud
      const companiesDownResult = await this.syncCompaniesFromCloud();
      if (!companiesDownResult.success) {
        throw new Error('Companies download failed: ' + companiesDownResult.message);
      }

      const projectsDownResult = await this.syncProjectsFromCloud();
      if (!projectsDownResult.success) {
        throw new Error('Projects download failed: ' + projectsDownResult.message);
      }

      console.log('Full sync completed successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error in full sync:', error);
      return { success: false, message: error.message };
    }
  }
}
