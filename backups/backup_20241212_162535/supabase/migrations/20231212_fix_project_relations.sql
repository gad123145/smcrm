-- First, let's drop the existing foreign key constraint
ALTER TABLE ai_project_insights
DROP CONSTRAINT IF EXISTS ai_project_insights_project_id_fkey;

-- Add the new foreign key constraint with CASCADE DELETE
ALTER TABLE ai_project_insights
ADD CONSTRAINT ai_project_insights_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES projects(id)
ON DELETE CASCADE;

-- Now let's delete the specific project and all its related data
DO $$
DECLARE
    target_project_id UUID := '84af521e-64da-402b-bebc-be84239311eb';
BEGIN
    -- Delete AI insights
    DELETE FROM ai_project_insights WHERE project_id = target_project_id;
    
    -- Delete properties
    DELETE FROM properties WHERE project_id = target_project_id;
    
    -- Delete backups if they exist
    DELETE FROM backups WHERE project_id = target_project_id;
    
    -- Delete shared projects
    DELETE FROM shared_projects WHERE project_id = target_project_id;
    
    -- Finally delete the project
    DELETE FROM projects WHERE id = target_project_id;
    
    RAISE NOTICE 'Project % and all related data have been deleted', target_project_id;
END $$;
