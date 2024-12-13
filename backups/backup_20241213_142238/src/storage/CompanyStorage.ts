import { generateId } from '@/lib/utils';
import { createProject, getProjects } from './projects';

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  price: number;
  project_area: number;
  created_at: string;
  updated_at: string;
  images?: string[];
  company_id: string;
}

export interface CompanyData {
  company: Company;
  projects: Project[];
}

// Get all storage keys for a company
const getCompanyStorageKeys = (companyId: string) => ({
  companyData: `company_${companyId}`,
  companyList: 'companies_list'
});

// Get all companies list (only basic info)
export const getCompaniesList = (): Company[] => {
  try {
    const companiesListData = localStorage.getItem('companies_list');
    return companiesListData ? JSON.parse(companiesListData) : [];
  } catch (error) {
    console.error('[getCompaniesList] Error:', error);
    return [];
  }
};

// Get a company by its ID
export const getCompanyById = (companyId: string): Company | null => {
  try {
    const companies = getCompaniesList();
    return companies.find(company => company.id === companyId) || null;
  } catch (error) {
    console.error('[getCompanyById] Error:', error);
    return null;
  }
};

// Get complete company data including projects
export const getCompanyData = (companyId: string): CompanyData | null => {
  try {
    const { companyData } = getCompanyStorageKeys(companyId);
    const data = localStorage.getItem(companyData);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`[getCompanyData] Error getting company ${companyId}:`, error);
    return null;
  }
};

// Create new company
export const createCompany = (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Company => {
  try {
    const companies = getCompaniesList();
    const now = new Date().toISOString();
    
    // Create new company
    const newCompany: Company = {
      ...companyData,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };

    // Add to companies list
    companies.push(newCompany);
    localStorage.setItem('companies_list', JSON.stringify(companies));

    // Create company storage with empty projects
    const { companyData: companyKey } = getCompanyStorageKeys(newCompany.id);
    const companyStorage: CompanyData = {
      company: newCompany,
      projects: [],
    };
    localStorage.setItem(companyKey, JSON.stringify(companyStorage));

    return newCompany;
  } catch (error) {
    console.error('[createCompany] Error:', error);
    throw error;
  }
};

// Add project to company
export const addProjectToCompany = (companyId: string, projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'company_id'>): Project | null => {
  try {
    const companyData = getCompanyData(companyId);
    if (!companyData) return null;

    // Create project in projects storage
    const newProject = createProject({
      ...projectData,
      company_id: companyId
    });

    if (!newProject) return null;

    // Update company data with new project
    companyData.projects = [...companyData.projects, newProject];
    const { companyData: companyKey } = getCompanyStorageKeys(companyId);
    localStorage.setItem(companyKey, JSON.stringify(companyData));

    return newProject;
  } catch (error) {
    console.error(`[addProjectToCompany] Error adding project to company ${companyId}:`, error);
    return null;
  }
};

// Get company projects
export const getCompanyProjects = (companyId: string): Project[] => {
  try {
    // Get projects from projects storage
    const allProjects = getProjects();
    return allProjects.filter(project => project.company_id === companyId);
  } catch (error) {
    console.error(`[getCompanyProjects] Error getting projects for company ${companyId}:`, error);
    return [];
  }
};

// Update company
export const updateCompany = (companyId: string, updates: Partial<Company>): Company | null => {
  try {
    const { companyData: companyKey } = getCompanyStorageKeys(companyId);
    const companyData = getCompanyData(companyId);
    if (!companyData) return null;

    // Update company in storage
    const updatedCompany: Company = {
      ...companyData.company,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    companyData.company = updatedCompany;
    localStorage.setItem(companyKey, JSON.stringify(companyData));

    // Update in companies list
    const companies = getCompaniesList();
    const companyIndex = companies.findIndex(c => c.id === companyId);
    if (companyIndex !== -1) {
      companies[companyIndex] = updatedCompany;
      localStorage.setItem('companies_list', JSON.stringify(companies));
    }

    return updatedCompany;
  } catch (error) {
    console.error(`[updateCompany] Error updating company ${companyId}:`, error);
    return null;
  }
};

// Update project
export const updateCompanyProject = (companyId: string, projectId: string, updates: Partial<Project>): Project | null => {
  try {
    const { companyData: companyKey } = getCompanyStorageKeys(companyId);
    const companyData = getCompanyData(companyId);
    if (!companyData) return null;

    const projectIndex = companyData.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return null;

    const updatedProject: Project = {
      ...companyData.projects[projectIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    companyData.projects[projectIndex] = updatedProject;
    localStorage.setItem(companyKey, JSON.stringify(companyData));

    return updatedProject;
  } catch (error) {
    console.error(`[updateCompanyProject] Error updating project ${projectId} in company ${companyId}:`, error);
    return null;
  }
};

// Delete company
export const deleteCompany = (companyId: string): void => {
  try {
    const { companyData: companyKey, companyList } = getCompanyStorageKeys(companyId);
    
    // 1. حذف بيانات الشركة من قائمة الشركات
    const companies = getCompaniesList();
    const filteredCompanies = companies.filter(c => c.id !== companyId);
    localStorage.setItem(companyList, JSON.stringify(filteredCompanies));

    // 2. حذف مخزن بيانات الشركة (يتضمن المشاريع)
    localStorage.removeItem(companyKey);

    console.log(`[deleteCompany] Successfully deleted company ${companyId} and all its data`);
  } catch (error) {
    console.error(`[deleteCompany] Error deleting company ${companyId}:`, error);
    throw error;
  }
};

// Delete project
export const deleteCompanyProject = (companyId: string, projectId: string): void => {
  try {
    const { companyData: companyKey } = getCompanyStorageKeys(companyId);
    const companyData = getCompanyData(companyId);
    if (!companyData) return;

    companyData.projects = companyData.projects.filter(p => p.id !== projectId);
    localStorage.setItem(companyKey, JSON.stringify(companyData));
  } catch (error) {
    console.error(`[deleteCompanyProject] Error deleting project ${projectId} from company ${companyId}:`, error);
    throw error;
  }
};
