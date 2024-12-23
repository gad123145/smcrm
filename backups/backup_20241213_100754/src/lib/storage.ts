import { Project, Contact, Task, AIProjectInsight, Company } from '../types/types';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Companies
export const getCompanies = (): Company[] => {
  try {
    const companies = localStorage.getItem('companies');
    console.log('[getCompanies] Raw data from localStorage:', companies);
    const parsedCompanies = companies ? JSON.parse(companies) : [];
    console.log('[getCompanies] Parsed companies:', parsedCompanies);
    return parsedCompanies;
  } catch (error) {
    console.error('[getCompanies] Error getting companies:', error);
    return [];
  }
};

export const getCompanyById = (id: string): Company | null => {
  try {
    console.log('[getCompanyById] Looking for company with ID:', id);
    const companies = getCompanies();
    console.log('[getCompanyById] All companies:', companies);
    const company = companies.find(company => company.id === id);
    console.log('[getCompanyById] Found company:', company);
    return company || null;
  } catch (error) {
    console.error('[getCompanyById] Error getting company by ID:', error);
    return null;
  }
};

export const addCompany = async (company: Omit<Company, 'id'>) => {
  try {
    const companies = getCompanies();
    const newCompany = { 
      ...company, 
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    companies.push(newCompany);
    localStorage.setItem('companies', JSON.stringify(companies));
    console.log('Added new company:', newCompany);
    return { data: newCompany, error: null };
  } catch (error) {
    console.error('Error adding company:', error);
    return { data: null, error: 'Failed to add company' };
  }
};

export const updateCompany = async (id: string, updates: Partial<Company>) => {
  try {
    const companies = getCompanies();
    const index = companies.findIndex(c => c.id === id);
    if (index !== -1) {
      companies[index] = { 
        ...companies[index], 
        ...updates,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('companies', JSON.stringify(companies));
      console.log('Updated company:', companies[index]);
      return { data: companies[index], error: null };
    }
    return { data: null, error: 'Company not found' };
  } catch (error) {
    console.error('Error updating company:', error);
    return { data: null, error: 'Failed to update company' };
  }
};

export const deleteCompany = async (id: string) => {
  try {
    const companies = getCompanies();
    const filteredCompanies = companies.filter(c => c.id !== id);
    localStorage.setItem('companies', JSON.stringify(filteredCompanies));
    
    // Also delete related projects
    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.company_id !== id);
    localStorage.setItem('projects', JSON.stringify(filteredProjects));
    
    console.log('Deleted company and related projects for ID:', id);
    return { error: null };
  } catch (error) {
    console.error('Error deleting company:', error);
    return { error: 'Failed to delete company' };
  }
};

// Projects
export const getProjects = (): Project[] => {
  try {
    const projects = localStorage.getItem('projects');
    console.log('Retrieved projects from storage:', projects);
    return projects ? JSON.parse(projects) : [];
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
};

export interface Project {
  id: string;
  company_id: string;
  name: string;
  description: string;
  type: string;
  manager: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  price: number;
  project_area: number;
  created_at: string;
  updated_at: string;
  images: string[]; // إضافة مصفوفة للصور
}

export const addProject = async (project: Omit<Project, 'id'>) => {
  try {
    const projects = getProjects();
    const newProject = { 
      ...project, 
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: project.images || [], // التأكد من وجود مصفوفة الصور
    };
    
    // Add the project to the projects list
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));

    // If the project has a company_id, add it to the company's projects
    if (project.company_id) {
      const companyProjects = getCompanyProjects(project.company_id);
      companyProjects.push(newProject.id);
      localStorage.setItem(`company_projects_${project.company_id}`, JSON.stringify(companyProjects));
    }

    console.log('Added new project:', newProject);
    return { data: newProject, error: null };
  } catch (error) {
    console.error('Error adding project:', error);
    return { data: null, error: 'Failed to add project' };
  }
};

export const getCompanyProjects = (companyId: string): string[] => {
  try {
    const projectIds = localStorage.getItem(`company_projects_${companyId}`);
    console.log('Retrieved company projects from storage:', projectIds);
    return projectIds ? JSON.parse(projectIds) : [];
  } catch (error) {
    console.error('Error getting company projects:', error);
    return [];
  }
};

export const getProjectsByCompany = (companyId: string): Project[] => {
  try {
    const projectIds = getCompanyProjects(companyId);
    const allProjects = getProjects();
    console.log('Retrieved projects by company:', allProjects);
    return allProjects.filter(project => projectIds.includes(project.id));
  } catch (error) {
    console.error('Error getting projects by company:', error);
    return [];
  }
};

export const updateProject = async (project: Project | string, updates?: Partial<Project>) => {
  try {
    const projects = getProjects();
    let index: number;
    let updatedProject: Project;

    if (typeof project === 'string') {
      // If first argument is an ID
      index = projects.findIndex(p => p.id === project);
      if (index !== -1 && updates) {
        updatedProject = { 
          ...projects[index], 
          ...updates,
          updated_at: new Date().toISOString(),
          images: updates.images || projects[index].images || [], // الحفاظ على الصور الحالية إذا لم يتم تحديثها
        };
      } else {
        throw new Error('Project not found');
      }
    } else {
      // If first argument is a Project object
      index = projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        updatedProject = {
          ...project,
          updated_at: new Date().toISOString(),
          images: project.images || [], // التأكد من وجود مصفوفة الصور
        };
      } else {
        throw new Error('Project not found');
      }
    }

    projects[index] = updatedProject;
    localStorage.setItem('projects', JSON.stringify(projects));
    console.log('Updated project:', updatedProject);
    return { data: updatedProject, error: null };
  } catch (error) {
    console.error('Error updating project:', error);
    return { data: null, error: 'Failed to update project' };
  }
};

export const deleteProject = async (id: string) => {
  try {
    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(filteredProjects));
    
    // Also delete related insights
    const insights = getProjectInsights();
    const filteredInsights = insights.filter(i => i.project_id !== id);
    localStorage.setItem('project_insights', JSON.stringify(filteredInsights));
    
    // If the project has a company_id, remove it from the company's projects
    const project = projects.find(p => p.id === id);
    if (project && project.company_id) {
      const companyProjects = getCompanyProjects(project.company_id);
      const filteredCompanyProjects = companyProjects.filter(cp => cp !== id);
      localStorage.setItem(`company_projects_${project.company_id}`, JSON.stringify(filteredCompanyProjects));
    }

    console.log('Deleted project and related insights for ID:', id);
    return { error: null };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { error: 'Failed to delete project' };
  }
};

// Contacts
export const getContacts = (): Contact[] => {
  try {
    const contacts = localStorage.getItem('contacts');
    console.log('Retrieved contacts from storage:', contacts);
    return contacts ? JSON.parse(contacts) : [];
  } catch (error) {
    console.error('Error getting contacts:', error);
    return [];
  }
};

export const addContact = async (contact: Omit<Contact, 'id'>) => {
  try {
    const contacts = getContacts();
    const newContact = { ...contact, id: generateId() };
    contacts.push(newContact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    console.log('Added new contact:', newContact);
    return { data: newContact, error: null };
  } catch (error) {
    console.error('Error adding contact:', error);
    return { data: null, error: 'Failed to add contact' };
  }
};

export const updateContact = async (id: string, updates: Partial<Contact>) => {
  try {
    const contacts = getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updates };
      localStorage.setItem('contacts', JSON.stringify(contacts));
      console.log('Updated contact:', contacts[index]);
      return { data: contacts[index], error: null };
    }
    return { data: null, error: 'Contact not found' };
  } catch (error) {
    console.error('Error updating contact:', error);
    return { data: null, error: 'Failed to update contact' };
  }
};

export const deleteContact = async (id: string) => {
  try {
    const contacts = getContacts();
    const filteredContacts = contacts.filter(c => c.id !== id);
    localStorage.setItem('contacts', JSON.stringify(filteredContacts));
    console.log('Deleted contact for ID:', id);
    return { error: null };
  } catch (error) {
    console.error('Error deleting contact:', error);
    return { error: 'Failed to delete contact' };
  }
};

// Tasks
export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem('tasks');
    console.log('Retrieved tasks from storage:', tasks);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

export const addTask = async (task: Omit<Task, 'id'>) => {
  try {
    const tasks = getTasks();
    const newTask = { ...task, id: generateId() };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Added new task:', newTask);
    return { data: newTask, error: null };
  } catch (error) {
    console.error('Error adding task:', error);
    return { data: null, error: 'Failed to add task' };
  }
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  try {
    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      localStorage.setItem('tasks', JSON.stringify(tasks));
      console.log('Updated task:', tasks[index]);
      return { data: tasks[index], error: null };
    }
    return { data: null, error: 'Task not found' };
  } catch (error) {
    console.error('Error updating task:', error);
    return { data: null, error: 'Failed to update task' };
  }
};

export const deleteTask = async (id: string) => {
  try {
    const tasks = getTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    console.log('Deleted task for ID:', id);
    return { error: null };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { error: 'Failed to delete task' };
  }
};

// AI Project Insights
export const getProjectInsights = (): AIProjectInsight[] => {
  try {
    const insights = localStorage.getItem('project_insights');
    console.log('Retrieved project insights from storage:', insights);
    return insights ? JSON.parse(insights) : [];
  } catch (error) {
    console.error('Error getting project insights:', error);
    return [];
  }
};

export const addProjectInsight = async (insight: Omit<AIProjectInsight, 'id'>) => {
  try {
    const insights = getProjectInsights();
    const newInsight = { ...insight, id: generateId() };
    insights.push(newInsight);
    localStorage.setItem('project_insights', JSON.stringify(insights));
    console.log('Added new project insight:', newInsight);
    return { data: newInsight, error: null };
  } catch (error) {
    console.error('Error adding project insight:', error);
    return { data: null, error: 'Failed to add project insight' };
  }
};

export const deleteProjectInsight = async (projectId: string) => {
  try {
    const insights = getProjectInsights();
    const filteredInsights = insights.filter(i => i.project_id !== projectId);
    localStorage.setItem('project_insights', JSON.stringify(filteredInsights));
    console.log('Deleted project insight for project ID:', projectId);
    return { error: null };
  } catch (error) {
    console.error('Error deleting project insight:', error);
    return { error: 'Failed to delete project insight' };
  }
};

// Initialize test data
export function initializeTestData() {
  try {
    console.log('[initializeTestData] Starting initialization...');
    
    // Clear existing data
    localStorage.clear();
    console.log('[initializeTestData] Cleared localStorage');

    // Add test company
    const company = {
      id: 'test-company-1',
      name: 'شركة الإعمار العقارية',
      description: 'شركة رائدة في مجال التطوير العقاري',
      email: 'info@example.com',
      phone: '+20123456789',
      address: 'القاهرة، مصر',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add test projects
    const projects = [
      {
        id: 'test-project-1',
        company_id: 'test-company-1',
        name: 'مشروع البحيرة السكني',
        description: 'مجمع سكني فاخر مع إطلالة على البحيرة',
        type: 'residential',
        manager: 'أحمد محمد',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        status: 'in_progress',
        priority: 'high',
        price: 5000000,
        project_area: 10000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: []
      },
      {
        id: 'test-project-2',
        company_id: 'test-company-1',
        name: 'برج النيل التجاري',
        description: 'برج تجاري حديث في قلب المدينة',
        type: 'commercial',
        manager: 'سارة أحمد',
        start_date: '2024-03-01',
        end_date: '2026-02-28',
        status: 'planning',
        priority: 'medium',
        price: 8000000,
        project_area: 15000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: []
      }
    ];

    // Save to localStorage
    console.log('[initializeTestData] Saving company:', company);
    localStorage.setItem('companies', JSON.stringify([company]));
    
    console.log('[initializeTestData] Saving projects:', projects);
    localStorage.setItem('projects', JSON.stringify(projects));

    console.log('[initializeTestData] Test data initialized successfully');
    
    // Verify data was saved correctly
    const savedCompanies = localStorage.getItem('companies');
    const savedProjects = localStorage.getItem('projects');
    console.log('[initializeTestData] Verification - Saved companies:', savedCompanies);
    console.log('[initializeTestData] Verification - Saved projects:', savedProjects);
    
    return company.id;
  } catch (error) {
    console.error('[initializeTestData] Error initializing test data:', error);
    return null;
  }
}
