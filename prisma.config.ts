import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    // Connection URL for migrations (direct connection, NOT pooler)
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
