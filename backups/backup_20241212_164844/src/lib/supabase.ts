import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const deleteProject = async (projectId: string) => {
  console.log('Starting project deletion process for ID:', projectId)
  
  try {
    // Delete AI insights first
    const { error: insightsError } = await supabase
      .from('ai_project_insights')
      .delete()
      .eq('project_id', projectId)
    
    if (insightsError) {
      console.error('Error deleting AI insights:', insightsError)
    }

    // Delete properties
    const { error: propertiesError } = await supabase
      .from('properties')
      .delete()
      .eq('project_id', projectId)
    
    if (propertiesError) {
      console.error('Error deleting properties:', propertiesError)
    }

    // Delete backups
    const { error: backupsError } = await supabase
      .from('backups')
      .delete()
      .eq('project_id', projectId)
    
    if (backupsError) {
      console.error('Error deleting backups:', backupsError)
    }

    // Delete shared projects
    const { error: sharedError } = await supabase
      .from('shared_projects')
      .delete()
      .eq('project_id', projectId)
    
    if (sharedError) {
      console.error('Error deleting shared projects:', sharedError)
    }

    // Finally delete the project
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (projectError) {
      console.error('Error deleting project:', projectError)
      return { success: false, error: projectError }
    }

    console.log('Project deleted successfully')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error during project deletion:', error)
    return { success: false, error }
  }
}
