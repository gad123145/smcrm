CREATE OR REPLACE FUNCTION force_delete_project(project_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all related records first
  DELETE FROM project_units WHERE project_id = $1;
  DELETE FROM project_backups WHERE project_id = $1;
  DELETE FROM project_shares WHERE project_id = $1;
  
  -- Finally delete the project
  DELETE FROM projects WHERE id = $1;
END;
$$;
