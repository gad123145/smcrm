import { generateId } from '@/lib/utils';
import { deleteProject, getProjectsByCompanyId } from './projects';

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

const COMPANIES_STORAGE_KEY = 'companies';

export const getCompanies = (): Company[] => {
  try {
    console.log('[getCompanies] Getting companies from localStorage');
    const companiesData = localStorage.getItem(COMPANIES_STORAGE_KEY);
    if (!companiesData) {
      console.log('[getCompanies] No companies found in localStorage');
      return [];
    }
    console.log('[getCompanies] Raw data from localStorage:', companiesData);
    const companies = JSON.parse(companiesData);
    console.log('[getCompanies] Parsed companies:', companies);
    return companies;
  } catch (error) {
    console.error('[getCompanies] Error getting companies:', error);
    return [];
  }
};

export const getCompanyById = (companyId: string): Company | null => {
  try {
    console.log('[getCompanyById] Looking for company with ID:', companyId);
    const companies = getCompanies();
    const company = companies.find(company => company.id === companyId);
    console.log('[getCompanyById] Found company:', company);
    return company || null;
  } catch (error) {
    console.error('[getCompanyById] Error getting company:', error);
    return null;
  }
};

export const createCompany = (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Company => {
  try {
    const companies = getCompanies();
    const now = new Date().toISOString();
    const newCompany: Company = {
      ...company,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };
    companies.push(newCompany);
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
    console.log('[createCompany] Created new company:', newCompany);
    return newCompany;
  } catch (error) {
    console.error('[createCompany] Error creating company:', error);
    throw error;
  }
};

export const updateCompany = (companyId: string, updates: Partial<Company>): Company => {
  try {
    const companies = getCompanies();
    const companyIndex = companies.findIndex(company => company.id === companyId);
    if (companyIndex === -1) {
      throw new Error('Company not found');
    }
    const updatedCompany = {
      ...companies[companyIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    companies[companyIndex] = updatedCompany;
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
    console.log('[updateCompany] Updated company:', updatedCompany);
    return updatedCompany;
  } catch (error) {
    console.error('[updateCompany] Error updating company:', error);
    throw error;
  }
};

export const deleteCompany = async (companyId: string): Promise<void> => {
  try {
    // 1. Delete all projects associated with this company
    const companyProjects = getProjectsByCompanyId(companyId);
    for (const project of companyProjects) {
      await deleteProject(project.id);
    }

    // 2. Delete the company
    const companies = getCompanies();
    const updatedCompanies = companies.filter(company => company.id !== companyId);
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(updatedCompanies));
    console.log('[deleteCompany] Deleted company and its projects:', companyId);
  } catch (error) {
    console.error('[deleteCompany] Error deleting company:', error);
    throw error;
  }
};
