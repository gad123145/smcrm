-- First, disable triggers temporarily to avoid any constraint issues
SET session_replication_role = 'replica';

DO $$
DECLARE
    target_project_id UUID := '84af521e-64da-402b-bebc-be84239311eb';
BEGIN
    -- Delete from ai_project_insights
    DELETE FROM ai_project_insights WHERE project_id = target_project_id;
    RAISE NOTICE 'Deleted from ai_project_insights';

    -- Delete from properties
    DELETE FROM properties WHERE project_id = target_project_id;
    RAISE NOTICE 'Deleted from properties';

    -- Delete from backups
    DELETE FROM backups WHERE project_id = target_project_id;
    RAISE NOTICE 'Deleted from backups';

    -- Delete from shared_projects
    DELETE FROM shared_projects WHERE project_id = target_project_id;
    RAISE NOTICE 'Deleted from shared_projects';

    -- Finally delete from projects
    DELETE FROM projects WHERE id = target_project_id;
    RAISE NOTICE 'Deleted from projects';
END $$;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Verify deletion
DO $$
DECLARE
    target_project_id UUID := '84af521e-64da-402b-bebc-be84239311eb';
    project_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM projects WHERE id = target_project_id
    ) INTO project_exists;
    
    IF project_exists THEN
        RAISE NOTICE 'Project still exists - deletion may have failed';
    ELSE
        RAISE NOTICE 'Project successfully deleted';
    END IF;
END $$;
