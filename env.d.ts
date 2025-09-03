// env.d.ts

/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_ALPHA_VANTAGE_KEY: string;
    PORT?: string;
    DATABASE_URL: string;
  }
}
