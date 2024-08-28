import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_constants/cors.ts";
import { CorsRequestHandler } from "../_types/cors.ts";

export const createServiceRoleClient = () => {
  return createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
};

export const createAuthenticatedUserClient = (req: Request) => {
  const authHeader = req.headers.get("Authorization")!;
  return createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authHeader } },
  });
};

// Implemented based off of https://supabase.com/docs/guides/functions/cors
// This function wraps around a request handler and adds CORS headers to the response
export function withSupabaseCors(handler: CorsRequestHandler): CorsRequestHandler {
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    try {
      const response = await handler(req);
      return new Response(response.body, {
        headers: { ...corsHeaders, ...Object.fromEntries(response.headers) },
        status: response.status,
      });
    } catch (error) {
      if (error instanceof Response) {
        console.error(error.body);
        return new Response(error.body, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: error.status,
        });
      }
      console.error(error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: error.status || 500,
      });
    }
  };
}

