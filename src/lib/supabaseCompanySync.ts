import { supabase } from './supabaseClient';
import { companyService } from '@/services/companyService';
import { projectService } from '@/services/projectService';
import type { Company, Project } from '@/types';

export class SupabaseCompanySync {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async syncCompaniesToCloud() {
    try {
      const { data: companies, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', this.userId);

      if (fetchError) throw fetchError;

      // Update or insert companies
      for (const company of companies || []) {
        await companyService.updateCompany(company.id, {
          ...company,
          last_synced: new Date().toISOString()
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error syncing companies to cloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncProjectsToCloud() {
    try {
      const { data: projects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', this.userId);

      if (fetchError) throw fetchError;

      // Update or insert projects
      for (const project of projects || []) {
        await projectService.updateProject(project.id, {
          ...project,
          last_synced: new Date().toISOString()
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error syncing projects to cloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncCompaniesFromCloud() {
    try {
      const companies = await companyService.getCompanies();
      return { success: true, data: companies };
    } catch (error) {
      console.error('Error syncing companies from cloud:', error);
      return { success: false, message: error.message };
    }
  }

  async syncProjectsFromCloud() {
    try {
      const projects = await projectService.getProjects();
      return { success: true, data: projects };
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
