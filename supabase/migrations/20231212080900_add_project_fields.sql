-- Add new fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS project_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS project_manager VARCHAR(100),
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS estimated_budget DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS actual_budget DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS risks TEXT[],
ADD COLUMN IF NOT EXISTS dependencies TEXT[],
ADD COLUMN IF NOT EXISTS milestones JSONB[],
ADD COLUMN IF NOT EXISTS team_members UUID[],
ADD COLUMN IF NOT EXISTS attachments JSONB[],
ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::JSONB;

-- Add comments to the new columns
COMMENT ON COLUMN projects.project_type IS 'Type of the project (e.g., Development, Design, Marketing)';
COMMENT ON COLUMN projects.project_manager IS 'Name of the project manager';
COMMENT ON COLUMN projects.start_date IS 'Project start date';
COMMENT ON COLUMN projects.end_date IS 'Project end date';
COMMENT ON COLUMN projects.status IS 'Current project status';
COMMENT ON COLUMN projects.priority IS 'Project priority level';
COMMENT ON COLUMN projects.estimated_budget IS 'Estimated project budget';
COMMENT ON COLUMN projects.actual_budget IS 'Actual project budget';
COMMENT ON COLUMN projects.completion_percentage IS 'Project completion percentage';
COMMENT ON COLUMN projects.risks IS 'Array of project risks';
COMMENT ON COLUMN projects.dependencies IS 'Array of project dependencies';
COMMENT ON COLUMN projects.milestones IS 'Array of project milestones as JSONB';
COMMENT ON COLUMN projects.team_members IS 'Array of team member UUIDs';
COMMENT ON COLUMN projects.attachments IS 'Array of project attachments as JSONB';
COMMENT ON COLUMN projects.custom_fields IS 'Custom project fields as JSONB';
