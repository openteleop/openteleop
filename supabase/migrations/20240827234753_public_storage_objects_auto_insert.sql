CREATE OR REPLACE FUNCTION public.on_insert_storage_object() RETURNS TRIGGER AS $$
BEGIN
    -- Abort insert if the last element of path_tokens is ".emptyFolderPlaceholder"
    IF NEW.path_tokens[array_upper(NEW.path_tokens, 1)] = '.emptyFolderPlaceholder' THEN
        RETURN NULL;
    END IF;

    -- -- Proceed with the insert if condition is not met
    INSERT INTO public.storage_objects (
        id,
        created_at,
        company_id,
        mime_type,
        bucket_name,
        file_name,
        path_keys,
        storage_object_id
    ) VALUES (
        NEW.path_tokens[array_upper(NEW.path_tokens, 1)]::uuid, -- object name cast to uuid => id 
        NEW.created_at,                                         -- created_at
        NEW.path_tokens[1]::uuid,                               -- company_id cast to uuid
        NEW.metadata->>'mimetype',                              -- mime_type
        NEW.bucket_id,                                          -- bucket_name
        split_part(NEW.name, '/', 3),                           -- file_name (assuming name format is fixed)
        NEW.path_tokens[1:array_upper(NEW.path_tokens, 1) - 1], -- path_keys (all but last element of path_tokens)
        NEW.id                                                  -- object id => storage_object_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE or REPLACE TRIGGER on_insert_storage_object_trigger
AFTER INSERT ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION public.on_insert_storage_object();