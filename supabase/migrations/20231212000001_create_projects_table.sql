-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their company projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert their company projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their company projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their company projects" ON public.projects;

-- Create policies
CREATE POLICY "Users can view their company projects"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = projects.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = projects.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company projects"
  ON public.projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = projects.company_id
      AND companies.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = projects.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company projects"
  ON public.projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = projects.company_id
      AND companies.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_project_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_project_updated_at_column();
