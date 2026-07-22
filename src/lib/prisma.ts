import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Prisma v7: Connection URL passed to constructor (not schema.prisma)
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    // During build / type generation, return a no-op client
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "DATABASE_URL environment variable is not set. " +
          "Please add it to your environment variables."
      );
    }
    // Development: return uninitialized client (Prisma Studio / generate will work)
    return new PrismaClient({
      log: ["error", "warn"],
    });
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
