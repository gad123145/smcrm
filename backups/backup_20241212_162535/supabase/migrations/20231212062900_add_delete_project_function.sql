-- Migration: Add delete_project_cascade function
-- Description: Creates a function to safely delete projects and related data

-- Drop the function if it exists
DROP FUNCTION IF EXISTS delete_project_cascade;

-- Create the new function with logging
CREATE OR REPLACE FUNCTION delete_project_cascade(project_id_param UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    deleted_counts JSONB = '{}'::JSONB;
    start_time TIMESTAMP;
BEGIN
    -- Record start time
    start_time := NOW();
    
    -- Set session to ignore triggers temporarily
    SET session_replication_role = 'replica';
    
    -- Delete from ai_project_insights and record count
    WITH deleted AS (
        DELETE FROM ai_project_insights WHERE project_id = project_id_param RETURNING *
    )
    SELECT deleted_counts || jsonb_build_object('ai_project_insights', COUNT(*))
    INTO deleted_counts
    FROM deleted;

    -- Delete from properties and record count
    WITH deleted AS (
        DELETE FROM properties WHERE "projectId" = project_id_param RETURNING *
    )
    SELECT deleted_counts || jsonb_build_object('properties', COUNT(*))
    INTO deleted_counts
    FROM deleted;

    -- Delete from tasks and record count
    WITH deleted AS (
        DELETE FROM tasks WHERE project_id = project_id_param RETURNING *
    )
    SELECT deleted_counts || jsonb_build_object('tasks', COUNT(*))
    INTO deleted_counts
    FROM deleted;

    -- Delete from notifications and record count
    WITH deleted AS (
        DELETE FROM notifications WHERE project_id = project_id_param RETURNING *
    )
    SELECT deleted_counts || jsonb_build_object('notifications', COUNT(*))
    INTO deleted_counts
    FROM deleted;

    -- Delete from chat_messages and record count
    WITH deleted AS (
        DELETE FROM chat_messages WHERE project_id = project_id_param RETURNING *
    )
    SELECT deleted_counts || jsonb_build_object('chat_messages', COUNT(*))
    INTO deleted_counts
    FROM deleted;

    -- Delete from chat_comments and record count
    WITH deleted AS (
        DELETE FROM chat_comments WHERE project_id = project_id_param RETURNING *
    )
    SELECT deleted_counts || jsonb_build_object('chat_comments', COUNT(*))
    INTO deleted_counts
    FROM deleted;

    -- Delete from chat_reactions and record count
    WITH deleted AS (
        DELETE FROM chat_reactions WHERE project_id = project_id_param RETURNING *
    )
    SELECT deleted_counts || jsonb_build_object('chat_reactions', COUNT(*))
    INTO deleted_counts
    FROM deleted;

    -- Finally delete from projects and record count
    WITH deleted AS (
        DELETE FROM projects WHERE id = project_id_param RETURNING *
    )
    SELECT deleted_counts || jsonb_build_object('projects', COUNT(*))
    INTO deleted_counts
    FROM deleted;
    
    -- Reset session
    SET session_replication_role = 'origin';
    
    -- Prepare success result
    result := jsonb_build_object(
        'success', true,
        'project_id', project_id_param,
        'deleted_counts', deleted_counts,
        'execution_time_ms', EXTRACT(EPOCH FROM (NOW() - start_time)) * 1000
    );
    
    RETURN result;
    
EXCEPTION WHEN OTHERS THEN
    -- Reset session in case of error
    SET session_replication_role = 'origin';
    
    -- Prepare error result
    result := jsonb_build_object(
        'success', false,
        'project_id', project_id_param,
        'error', SQLERRM,
        'error_detail', SQLSTATE,
        'execution_time_ms', EXTRACT(EPOCH FROM (NOW() - start_time)) * 1000
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add a comment to the function
COMMENT ON FUNCTION delete_project_cascade IS 'Safely deletes a project and all its related data across multiple tables. Returns a JSON object with deletion details and counts.';
