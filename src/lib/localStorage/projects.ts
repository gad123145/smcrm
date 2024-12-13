import { Project } from '@/types';

const PROJECTS_STORAGE_KEY = 'projects';

export function getProjects(): Project[] {
  try {
    const projectsJson = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return projectsJson ? JSON.parse(projectsJson) : [];
  } catch (error) {
    console.error('Error getting projects from localStorage:', error);
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
  }
}

export function addProject(project: Project) {
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
}

export function updateProject(updatedProject: Project) {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    saveProjects(projects);
  }
}

export function deleteProject(projectId: string) {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== projectId);
  saveProjects(filteredProjects);
}

export function getProjectById(projectId: string): Project | null {
  const projects = getProjects();
  return projects.find(p => p.id === projectId) || null;
}

export function getCompanyProjects(companyId: string): Project[] {
  const projects = getProjects();
  return projects.filter(p => p.company_id === companyId);
}
