/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  /** Server-only secret key. Required for site session writes. Never prefix with PUBLIC_. */
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly VISITOR_TOKEN_SECRET: string;
  readonly CONTACT_EMAIL?: string;
  readonly RESEND_API_KEY?: string;
  readonly CONTACT_FROM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
