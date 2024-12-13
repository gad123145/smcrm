import { generateId } from '@/lib/utils';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  price: number;
  project_area: number;
  company_id: string;
  created_at: string;
  updated_at: string;
  images?: string[];
}

const PROJECTS_STORAGE_KEY = 'projects';

export const getProjects = (): Project[] => {
  try {
    console.log('[getProjects] Getting projects from localStorage');
    const projectsData = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!projectsData) {
      console.log('[getProjects] No projects found in localStorage');
      return [];
    }
    console.log('[getProjects] Raw data from localStorage:', projectsData);
    const projects = JSON.parse(projectsData);
    console.log('[getProjects] Parsed projects:', projects);
    return projects;
  } catch (error) {
    console.error('[getProjects] Error getting projects:', error);
    return [];
  }
};

export const getProjectsByCompanyId = (companyId: string): Project[] => {
  try {
    console.log('[getProjectsByCompanyId] Looking for projects with company ID:', companyId);
    const projects = getProjects();
    const companyProjects = projects.filter(project => project.company_id === companyId);
    console.log('[getProjectsByCompanyId] Found projects:', companyProjects);
    return companyProjects;
  } catch (error) {
    console.error('[getProjectsByCompanyId] Error getting projects:', error);
    return [];
  }
};

export const getProjectById = (projectId: string): Project | null => {
  try {
    console.log('[getProjectById] Looking for project with ID:', projectId);
    const projects = getProjects();
    const project = projects.find(project => project.id === projectId);
    console.log('[getProjectById] Found project:', project);
    return project || null;
  } catch (error) {
    console.error('[getProjectById] Error getting project:', error);
    return null;
  }
};

export const createProject = (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project => {
  try {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };

    // Get existing projects
    const projects = getProjects();
    
    // Add new project
    projects.push(newProject);
    
    // Save to localStorage
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    console.log('[createProject] Project created:', newProject);
    
    return newProject;
  } catch (error) {
    console.error('[createProject] Error creating project:', error);
    throw error;
  }
};

export const updateProject = (projectId: string, updates: Partial<Project>): Project => {
  try {
    const projects = getProjects();
    const projectIndex = projects.findIndex(project => project.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    const updatedProject = {
      ...projects[projectIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    projects[projectIndex] = updatedProject;
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    console.log('[updateProject] Updated project:', updatedProject);
    return updatedProject;
  } catch (error) {
    console.error('[updateProject] Error updating project:', error);
    throw error;
  }
};

export const deleteProject = (projectId: string): void => {
  try {
    const projects = getProjects();
    const updatedProjects = projects.filter(project => project.id !== projectId);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    console.log('[deleteProject] Deleted project:', projectId);
  } catch (error) {
    console.error('[deleteProject] Error deleting project:', error);
    throw error;
  }
};
