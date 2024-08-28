/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_ENV_NAME: string;
  VITE_APP_SUPABASE_URL: string;
  VITE_APP_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
