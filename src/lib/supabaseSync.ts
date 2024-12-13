import { supabase } from '@/integrations/supabase/client';
import type { Client, Company, Project } from '@/types';

export class SupabaseSync {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // المزامنة المحلية للعملاء
  private async getLocalClients(): Promise<Client[]> {
    try {
      const clientsJson = localStorage.getItem('clients');
      return clientsJson ? JSON.parse(clientsJson) : [];
    } catch (error) {
      console.error('خطأ في جلب العملاء المحليين:', error);
      return [];
    }
  }

  private async saveLocalClients(clients: Client[]) {
    try {
      localStorage.setItem('clients', JSON.stringify(clients));
    } catch (error) {
      console.error('خطأ في حفظ العملاء المحليين:', error);
      throw error;
    }
  }

  // المزامنة المحلية للشركات
  private async getLocalCompanies(): Promise<Company[]> {
    try {
      const companiesJson = localStorage.getItem('companies');
      return companiesJson ? JSON.parse(companiesJson) : [];
    } catch (error) {
      console.error('خطأ في جلب الشركات المحلية:', error);
      return [];
    }
  }

  private async saveLocalCompanies(companies: Company[]) {
    try {
      localStorage.setItem('companies', JSON.stringify(companies));
    } catch (error) {
      console.error('خطأ في حفظ الشركات المحلية:', error);
      throw error;
    }
  }

  // المزامنة المحلية للمشاريع
  private async getLocalProjects(): Promise<Project[]> {
    try {
      const projectsJson = localStorage.getItem('projects');
      return projectsJson ? JSON.parse(projectsJson) : [];
    } catch (error) {
      console.error('خطأ في جلب المشاريع المحلية:', error);
      return [];
    }
  }

  private async saveLocalProjects(projects: Project[]) {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (error) {
      console.error('خطأ في حفظ المشاريع المحلية:', error);
      throw error;
    }
  }

  // مزامنة العملاء إلى السحابة
  async syncClientsToCloud() {
    try {
      console.log('بدء مزامنة العملاء إلى السحابة...');
      const localClients = await this.getLocalClients();
      
      if (!localClients.length) {
        console.log('لا يوجد عملاء محليين للمزامنة');
        return { success: true };
      }

      const { error } = await supabase
        .from('clients')
        .upsert(
          localClients.map(client => ({
            ...client,
            user_id: this.userId,
            last_synced: new Date().toISOString()
          }))
        );

      if (error) {
        console.error('خطأ في مزامنة العملاء إلى السحابة:', error);
        throw error;
      }

      console.log('تمت مزامنة العملاء إلى السحابة بنجاح');
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في مزامنة العملاء إلى السحابة:', error);
      return { success: false, message: error.message };
    }
  }

  // مزامنة الشركات إلى السحابة
  async syncCompaniesToCloud() {
    try {
      console.log('بدء مزامنة الشركات إلى السحابة...');
      const localCompanies = await this.getLocalCompanies();
      
      if (!localCompanies.length) {
        console.log('لا يوجد شركات محلية للمزامنة');
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
        console.error('خطأ في مزامنة الشركات إلى السحابة:', error);
        throw error;
      }

      console.log('تمت مزامنة الشركات إلى السحابة بنجاح');
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في مزامنة الشركات إلى السحابة:', error);
      return { success: false, message: error.message };
    }
  }

  // مزامنة المشاريع إلى السحابة
  async syncProjectsToCloud() {
    try {
      console.log('بدء مزامنة المشاريع إلى السحابة...');
      const localProjects = await this.getLocalProjects();
      
      if (!localProjects.length) {
        console.log('لا يوجد مشاريع محلية للمزامنة');
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
        console.error('خطأ في مزامنة المشاريع إلى السحابة:', error);
        throw error;
      }

      console.log('تمت مزامنة المشاريع إلى السحابة بنجاح');
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في مزامنة المشاريع إلى السحابة:', error);
      return { success: false, message: error.message };
    }
  }

  // مزامنة العملاء من السحابة
  async syncClientsFromCloud() {
    try {
      console.log('بدء مزامنة العملاء من السحابة...');
      const { data: cloudClients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في جلب العملاء من السحابة:', error);
        throw error;
      }

      if (!cloudClients) {
        console.log('لا يوجد عملاء في السحابة');
        return { success: true };
      }

      await this.saveLocalClients(cloudClients);
      console.log('تمت مزامنة العملاء من السحابة بنجاح');
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في مزامنة العملاء من السحابة:', error);
      return { success: false, message: error.message };
    }
  }

  // مزامنة الشركات من السحابة
  async syncCompaniesFromCloud() {
    try {
      console.log('بدء مزامنة الشركات من السحابة...');
      const { data: cloudCompanies, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في جلب الشركات من السحابة:', error);
        throw error;
      }

      if (!cloudCompanies) {
        console.log('لا يوجد شركات في السحابة');
        return { success: true };
      }

      await this.saveLocalCompanies(cloudCompanies);
      console.log('تمت مزامنة الشركات من السحابة بنجاح');
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في مزامنة الشركات من السحابة:', error);
      return { success: false, message: error.message };
    }
  }

  // مزامنة المشاريع من السحابة
  async syncProjectsFromCloud() {
    try {
      console.log('بدء مزامنة المشاريع من السحابة...');
      const { data: cloudProjects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في جلب المشاريع من السحابة:', error);
        throw error;
      }

      if (!cloudProjects) {
        console.log('لا يوجد مشاريع في السحابة');
        return { success: true };
      }

      await this.saveLocalProjects(cloudProjects);
      console.log('تمت مزامنة المشاريع من السحابة بنجاح');
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في مزامنة المشاريع من السحابة:', error);
      return { success: false, message: error.message };
    }
  }

  // مزامنة كاملة
  async syncAll() {
    try {
      console.log('بدء المزامنة الكاملة...');
      
      // المزامنة إلى السحابة أولاً
      const clientsUpResult = await this.syncClientsToCloud();
      if (!clientsUpResult.success) {
        throw new Error('فشل رفع العملاء: ' + clientsUpResult.message);
      }

      const companiesUpResult = await this.syncCompaniesToCloud();
      if (!companiesUpResult.success) {
        throw new Error('فشل رفع الشركات: ' + companiesUpResult.message);
      }

      const projectsUpResult = await this.syncProjectsToCloud();
      if (!projectsUpResult.success) {
        throw new Error('فشل رفع المشاريع: ' + projectsUpResult.message);
      }

      // ثم المزامنة من السحابة
      const clientsDownResult = await this.syncClientsFromCloud();
      if (!clientsDownResult.success) {
        throw new Error('فشل تنزيل العملاء: ' + clientsDownResult.message);
      }

      const companiesDownResult = await this.syncCompaniesFromCloud();
      if (!companiesDownResult.success) {
        throw new Error('فشل تنزيل الشركات: ' + companiesDownResult.message);
      }

      const projectsDownResult = await this.syncProjectsFromCloud();
      if (!projectsDownResult.success) {
        throw new Error('فشل تنزيل المشاريع: ' + projectsDownResult.message);
      }

      console.log('تمت المزامنة الكاملة بنجاح');
      return { success: true };
    } catch (error: any) {
      console.error('خطأ في المزامنة الكاملة:', error);
      return { success: false, message: error.message };
    }
  }
}
