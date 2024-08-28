CREATE OR REPLACE FUNCTION auth.user_role() RETURNS text AS $$
BEGIN
    RETURN ((auth.jwt()::jsonb -> 'app_metadata') ->> 'user_role');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION auth.user_company_id() RETURNS uuid AS $$
BEGIN
    RETURN ((auth.jwt()::jsonb -> 'app_metadata') ->> 'user_company_id')::uuid; 
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "public"."on_update_user_data" () returns "trigger" language "plpgsql" security definer as $$BEGIN
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
    jsonb_set(raw_app_meta_data, '{user_company_id}', to_jsonb(NEW.company_id), true),
    '{user_role}', to_jsonb(NEW.role), true)
WHERE auth.users.id = NEW.id;
RETURN NEW;
END;$$;

CREATE OR REPLACE TRIGGER "on_update_user_data_trigger" AFTER INSERT OR UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."on_update_user_data"();
