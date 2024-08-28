import { User } from "../_types/global/user.ts";
import { createAuthenticatedUserClient, createServiceRoleClient, withSupabaseCors } from "../_connections/supabase.ts";
import { Company } from "../_types/global/company.ts";
import { companyAccentColorMap } from "../_constants/colors.ts";

Deno.serve(
  withSupabaseCors(async (req: Request) => {
    const supabaseServiceRole = createServiceRoleClient();
    const supabaseAuthenticatedUserRole = createAuthenticatedUserClient(req);

    // Validate privileges
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const {
      data: { user: requestingUser },
    } = await supabaseAuthenticatedUserRole.auth.getUser(token);
    if (requestingUser?.app_metadata?.user_role !== "admin" || requestingUser?.role !== "authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }

    // Validate request
    const { user: newUser }: { user: User } = await req.json();
    if (!newUser?.role || !newUser?.email || !newUser?.first_name || !newUser?.last_name) {
      console.warn("Missing required fields", newUser);
      return new Response("Missing required fields", { status: 400 });
    }

    // Get name of requesting user's company
    const { data: company, error: companyError } = await supabaseAuthenticatedUserRole
      .from("companies")
      .select("*")
      .eq("id", requestingUser?.app_metadata?.user_company_id)
      .returns<Company[]>();
    if (companyError || !company?.[0]) {
      console.error(companyError);
      return new Response(companyError?.message ?? "Error getting company", { status: 500 });
    }

    // Create user
    const companyName = company[0].name;
    const companyLogoId = company[0].logo_light_storage_object_id;
    const companyLogoUrl = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/company_branding/${
      company[0].id
    }/${companyLogoId}`;
    const redirectUrl =
      Deno.env.get("ENV_NAME") === "production"
        ? `https://app.openteleop.com/auth/resetpassword`
        : `https://staging.app.openteleop.com/auth/resetpassword`;
    const {
      data: { user: newUserAuth },
      error: newUserAuthError,
    } = await supabaseServiceRole.auth.admin.inviteUserByEmail(newUser.email, {
      // data set's the raw_user_meta_data properties in the auth.users table
      // these values help to format the auth emails with the company's custom branding
      data: {
        company_name: companyName,
        company_logo_url: companyLogoUrl,
        company_accent_color: companyAccentColorMap[company[0]?.theme?.accent_color ?? "gray"],
      },
      redirectTo: redirectUrl,
    });
    if (newUserAuthError || !newUserAuth) {
      console.error(newUserAuthError);
      return new Response(newUserAuthError?.message ?? "Error inviting user", { status: 500 });
    }

    const { data: newUserPublic, error: newUserPublicError } = await supabaseServiceRole
      .from("users")
      .insert({
        id: newUserAuth.id,
        company_id: requestingUser?.app_metadata?.user_company_id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
        email: newUser.email,
      })
      .select("*")
      .returns<User[]>();
    if (newUserPublicError || !newUserPublic?.[0]) {
      console.error(newUserPublicError);
      return new Response(newUserPublicError?.message ?? "Error creating user", { status: 500 });
    }

    return new Response(JSON.stringify(newUserPublic[0]), {
      status: 200,
    });
  })
);
