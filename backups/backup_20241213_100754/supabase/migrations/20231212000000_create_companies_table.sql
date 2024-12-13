-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can insert their own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update their own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can delete their own companies" ON public.companies;

-- Create policies
CREATE POLICY "Users can view their own companies"
  ON public.companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies"
  ON public.companies FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies"
  ON public.companies FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
