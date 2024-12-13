import { create } from 'zustand'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface DataState {
  clients: any[]
  projects: any[]
  properties: any[]
  companies: any[]
  loading: boolean
  error: string | null
  fetchInitialData: () => Promise<void>
  setClients: (clients: any[]) => void
  setProjects: (projects: any[]) => void
  setProperties: (properties: any[]) => void
  setCompanies: (companies: any[]) => void
}

export const useDataStore = create<DataState>((set) => ({
  clients: [],
  projects: [],
  properties: [],
  companies: [],
  loading: false,
  error: null,

  fetchInitialData: async () => {
    set({ loading: true, error: null })
    try {
      // جلب البيانات بالتوازي لتحسين الأداء
      const [
        { data: clients, error: clientsError },
        { data: projects, error: projectsError },
        { data: properties, error: propertiesError },
        { data: companies, error: companiesError }
      ] = await Promise.all([
        supabase
          .from('clients')
          .select(`
            *,
            assigned_to_profile:profiles!assigned_to(full_name),
            created_by_profile:profiles!created_by(full_name)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false })
      ])

      if (clientsError) throw clientsError
      if (projectsError) throw projectsError
      if (propertiesError) throw propertiesError
      if (companiesError) throw companiesError

      set({
        clients: clients || [],
        projects: projects || [],
        properties: properties || [],
        companies: companies || [],
        loading: false
      })
    } catch (error: any) {
      console.error('Error fetching data:', error)
      set({ error: error.message, loading: false })
      toast.error('حدث خطأ في جلب البيانات')
    }
  },

  setClients: (clients) => set({ clients }),
  setProjects: (projects) => set({ projects }),
  setProperties: (properties) => set({ properties }),
  setCompanies: (companies) => set({ companies })
}))
