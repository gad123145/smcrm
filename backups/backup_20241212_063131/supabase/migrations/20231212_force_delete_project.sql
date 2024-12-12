-- Create a function to force delete a project and all its related data
CREATE OR REPLACE FUNCTION public.force_delete_project(project_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    image_path text;
BEGIN
    -- Delete all project units
    DELETE FROM project_units WHERE project_id = $1;
    
    -- Delete all project backups
    DELETE FROM project_backups WHERE project_id = $1;
    
    -- Delete all project shares
    DELETE FROM project_shares WHERE project_id = $1;
    
    -- Get and delete all project images from storage
    FOR image_path IN 
        SELECT unnest(images) 
        FROM projects 
        WHERE id = $1
    LOOP
        -- Log the image being deleted
        RAISE NOTICE 'Deleting image: %', image_path;
        -- Note: actual storage deletion needs to be handled by the application
    END LOOP;
    
    -- Finally delete the project itself
    DELETE FROM projects WHERE id = $1;
    
    -- Raise notice when done
    RAISE NOTICE 'Project % has been completely deleted', $1;
END;
$$;
