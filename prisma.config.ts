import dotenv from "dotenv";
import path from "node:path";
import { existsSync } from "node:fs";
import { defineConfig, env } from "prisma/config";

// Load .env.local only when running locally (the file won't exist on Vercel/CI).
// On Vercel, DATABASE_URL is injected directly into process.env via project settings.
if (existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
}

// Fall back to standard .env if present (covers other deployment environments).
dotenv.config();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
});
