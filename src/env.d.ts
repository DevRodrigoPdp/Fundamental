/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ADMIN_PASSWORD: string;
  readonly ADMIN_SESSION_SECRET: string;
  readonly SUPABASE_SECRET_KEY: string;
  readonly CLOUDINARY_CLOUD_NAME: string;
  readonly CLOUDINARY_API_KEY: string;
  readonly CLOUDINARY_API_SECRET: string;
  readonly VERCEL_DEPLOY_HOOK_URL: string | undefined;
}