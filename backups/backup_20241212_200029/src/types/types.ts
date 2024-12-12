export interface Project {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  start_date?: string;
  manager?: string;
  company_id?: string;
  budget?: number;
  price?: number;
  project_area?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  project_id?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AIProjectInsight {
  id: string;
  project_id: string;
  insight_type: string;
  content: string;
  created_at?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}
