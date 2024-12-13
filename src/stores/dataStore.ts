import { create } from 'zustand'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface DataState {
  projects: any[]
  properties: any[]
  companies: any[]
  loading: boolean
  error: string | null
  initialized: boolean
  fetchInitialData: () => Promise<void>
  addProject: (project: any) => void
  updateProject: (project: any) => void
  deleteProject: (id: string) => void
  addProperty: (property: any) => void
  updateProperty: (property: any) => void
  deleteProperty: (id: string) => void
  addCompany: (company: any) => void
  updateCompany: (company: any) => void
  deleteCompany: (id: string) => void
  reset: () => void
}

export const useDataStore = create<DataState>((set, get) => ({
  projects: [],
  properties: [],
  companies: [],
  loading: false,
  error: null,
  initialized: false,

  fetchInitialData: async () => {
    if (get().initialized) return;
    
    set({ loading: true, error: null });
    try {
      const [
        { data: projects, error: projectsError },
        { data: properties, error: propertiesError },
        { data: companies, error: companiesError }
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('companies').select('*').order('created_at', { ascending: false })
      ]);

      if (projectsError) throw projectsError;
      if (propertiesError) throw propertiesError;
      if (companiesError) throw companiesError;

      set({
        projects: projects || [],
        properties: properties || [],
        companies: companies || [],
        initialized: true,
        loading: false
      });
    } catch (error: any) {
      console.error('Error fetching data:', error);
      set({ error: error.message, loading: false });
      toast.error('حدث خطأ في جلب البيانات');
    }
  },

  // Projects
  addProject: (project) => {
    set((state) => ({
      projects: [project, ...state.projects]
    }));
  },

  updateProject: (updatedProject) => {
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === updatedProject.id ? updatedProject : project
      )
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter(project => project.id !== id)
    }));
  },

  // Properties
  addProperty: (property) => {
    set((state) => ({
      properties: [property, ...state.properties]
    }));
  },

  updateProperty: (updatedProperty) => {
    set((state) => ({
      properties: state.properties.map(property =>
        property.id === updatedProperty.id ? updatedProperty : property
      )
    }));
  },

  deleteProperty: (id) => {
    set((state) => ({
      properties: state.properties.filter(property => property.id !== id)
    }));
  },

  // Companies
  addCompany: (company) => {
    set((state) => ({
      companies: [company, ...state.companies]
    }));
  },

  updateCompany: (updatedCompany) => {
    set((state) => ({
      companies: state.companies.map(company =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
    }));
  },

  deleteCompany: (id) => {
    set((state) => ({
      companies: state.companies.filter(company => company.id !== id)
    }));
  },

  reset: () => {
    set({
      projects: [],
      properties: [],
      companies: [],
      loading: false,
      error: null,
      initialized: false
    });
  }
}));
