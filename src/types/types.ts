export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  client_id?: string;
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
