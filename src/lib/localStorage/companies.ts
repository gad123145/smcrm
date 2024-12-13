import { Company } from '@/types';

const COMPANIES_STORAGE_KEY = 'companies';

export function getCompanies(): Company[] {
  try {
    const companiesJson = localStorage.getItem(COMPANIES_STORAGE_KEY);
    return companiesJson ? JSON.parse(companiesJson) : [];
  } catch (error) {
    console.error('Error getting companies from localStorage:', error);
    return [];
  }
}

export function saveCompanies(companies: Company[]) {
  try {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
  } catch (error) {
    console.error('Error saving companies to localStorage:', error);
  }
}

export function addCompany(company: Company) {
  const companies = getCompanies();
  companies.push(company);
  saveCompanies(companies);
}

export function updateCompany(updatedCompany: Company) {
  const companies = getCompanies();
  const index = companies.findIndex(c => c.id === updatedCompany.id);
  if (index !== -1) {
    companies[index] = updatedCompany;
    saveCompanies(companies);
  }
}

export function deleteCompany(companyId: string) {
  const companies = getCompanies();
  const filteredCompanies = companies.filter(c => c.id !== companyId);
  saveCompanies(filteredCompanies);
}

export function getCompanyById(companyId: string): Company | null {
  const companies = getCompanies();
  return companies.find(c => c.id === companyId) || null;
}
