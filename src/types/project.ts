export interface Project {
  id: string;
  name: string;
  description?: string | null;
  project_type?: string | null;
  project_manager?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string;
  priority?: string;
  estimated_budget?: string | null;
  actual_budget?: string | null;
  completion_percentage?: number;
  risks?: string[];
  dependencies?: string[];
  milestones?: any[];
  team_members?: string[];
  price?: string | null;
  location?: string | null;
  operating_company?: string | null;
  project_area?: string | null;
  created_at?: string;
  updated_at?: string;
}