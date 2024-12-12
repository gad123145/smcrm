import { Project, Contact, Task, AIProjectInsight, Company } from '../types/types';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Companies
export const getCompanies = (): Company[] => {
  try {
    const companies = localStorage.getItem('companies');
    console.log('Retrieved companies from storage:', companies);
    return companies ? JSON.parse(companies) : [];
  } catch (error) {
    console.error('Error getting companies:', error);
    return [];
  }
};

export const getCompanyById = (id: string): Company | null => {
  try {
    const companies = getCompanies();
    console.log('Looking for company with ID:', id);
    console.log('Available companies:', companies);
    const company = companies.find(company => company.id === id);
    console.log('Found company:', company);
    return company || null;
  } catch (error) {
    console.error('Error getting company by ID:', error);
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

export const addProject = async (project: Omit<Project, 'id'>) => {
  try {
    const projects = getProjects();
    const newProject = { 
      ...project, 
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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

export const updateProject = async (id: string, updates: Partial<Project>) => {
  try {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      localStorage.setItem('projects', JSON.stringify(projects));
      console.log('Updated project:', projects[index]);
      return { data: projects[index], error: null };
    }
    return { data: null, error: 'Project not found' };
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
export const initializeTestData = () => {
  console.log('Initializing test data...');
  const companies = getCompanies();
  const projects = getProjects();

  // Only initialize if no data exists
  if (companies.length === 0) {
    const testCompany = {
      name: "شركة التطوير العقاري",
      description: "شركة رائدة في مجال التطوير العقاري",
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const testProject: Project = {
      id: generateId(),
      company_id: testCompany.id,
      name: "بيراميدز2",
      description: "مشروع بيراميدز2 السكني",
      type: "commercial",
      manager: "أحمد محمد",
      start_date: "2024-12-23",
      end_date: "2025-12-23",
      status: "completed",
      priority: "high",
      price: 8958461500,
      project_area: 1500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localStorage.setItem('companies', JSON.stringify([testCompany]));
    localStorage.setItem('projects', JSON.stringify([testProject]));
    
    console.log('Test data initialized with company:', testCompany.id);
    return testCompany.id;
  }

  // If companies exist but no ID provided, return first company ID
  if (companies.length > 0) {
    console.log('Returning first company ID:', companies[0].id);
    return companies[0].id;
  }

  return null;
};
