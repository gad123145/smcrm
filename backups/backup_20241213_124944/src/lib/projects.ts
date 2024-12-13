import { Project } from '@/types/types';

// Get all projects
export const getProjects = (): Project[] => {
  try {
    console.log('[getProjects] Getting projects from localStorage');
    const projects = localStorage.getItem('projects');
    console.log('[getProjects] Raw data from localStorage:', projects);
    const parsedProjects = projects ? JSON.parse(projects) : [];
    console.log('[getProjects] Parsed projects:', parsedProjects);
    return parsedProjects;
  } catch (error) {
    console.error('[getProjects] Error getting projects:', error);
    return [];
  }
};

// Get project by ID
export const getProjectById = (id: string): Project | null => {
  try {
    console.log('[getProjectById] Looking for project with ID:', id);
    const projects = getProjects();
    console.log('[getProjectById] All projects:', projects);
    const project = projects.find(project => project.id === id);
    console.log('[getProjectById] Found project:', project);
    return project || null;
  } catch (error) {
    console.error('[getProjectById] Error getting project by ID:', error);
    return null;
  }
};

// Get projects by company ID
export const getProjectsByCompanyId = (companyId: string): Project[] => {
  try {
    console.log('[getProjectsByCompanyId] Looking for projects with company ID:', companyId);
    const projects = getProjects();
    const companyProjects = projects.filter(project => project.company_id === companyId);
    console.log('[getProjectsByCompanyId] Found projects:', companyProjects);
    return companyProjects;
  } catch (error) {
    console.error('[getProjectsByCompanyId] Error getting projects by company ID:', error);
    return [];
  }
};

// Add new project
export const addProject = async (project: Omit<Project, 'id'>, companyId: string): Promise<{ data: Project | null; error: string | null }> => {
  try {
    const projects = getProjects();
    
    // Handle image uploads
    let processedImages: string[] = [];
    if (project.images && project.images.length > 0) {
      processedImages = await Promise.all(project.images.map(async (image: string) => {
        if (image.startsWith('blob:')) {
          try {
            const response = await fetch(image);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
          } catch (error) {
            console.error('Error processing image:', error);
            return '';
          }
        }
        return image;
      }));
      processedImages = processedImages.filter(img => img !== '');
    }

    const newProject = {
      ...project,
      id: Math.random().toString(36).substr(2, 9),
      company_id: companyId, // Explicitly set the company ID
      images: processedImages,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    console.log('[addProject] Added new project:', newProject);
    return { data: newProject, error: null };
  } catch (error) {
    console.error('[addProject] Error adding project:', error);
    return { data: null, error: 'Failed to add project' };
  }
};

// Update project
export const updateProject = async (id: string, updates: Partial<Project>): Promise<{ data: Project | null; error: string | null }> => {
  try {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      return { data: null, error: 'Project not found' };
    }

    // Handle image updates
    let processedImages = updates.images || [];
    if (updates.images && updates.images.length > 0) {
      processedImages = await Promise.all(updates.images.map(async (image: string) => {
        if (image.startsWith('blob:')) {
          try {
            const response = await fetch(image);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
          } catch (error) {
            console.error('Error processing image:', error);
            return '';
          }
        }
        return image;
      }));
      processedImages = processedImages.filter(img => img !== '');
    }

    const updatedProject = {
      ...projects[index],
      ...updates,
      images: processedImages,
      updated_at: new Date().toISOString(),
    };

    projects[index] = updatedProject;
    localStorage.setItem('projects', JSON.stringify(projects));
    console.log('[updateProject] Updated project:', updatedProject);
    return { data: updatedProject, error: null };
  } catch (error) {
    console.error('[updateProject] Error updating project:', error);
    return { data: null, error: 'Failed to update project' };
  }
};

// Delete project
export const deleteProject = async (id: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(filteredProjects));
    console.log('[deleteProject] Deleted project with ID:', id);
    return { success: true, error: null };
  } catch (error) {
    console.error('[deleteProject] Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
};
