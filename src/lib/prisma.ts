import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient(): PrismaClient {
  const connectionString = process.env["DATABASE_URL"];

  if (!connectionString || !/^postgres(ql)?:\/\//i.test(connectionString)) {
    throw new Error(
      "DATABASE_URL is missing or is not a PostgreSQL connection string. " +
        "Set it in .env.local for local development, or as an environment variable " +
        "on your deployment platform (e.g. Vercel → Settings → Environment Variables)."
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Lazily initialised Prisma client.
 *
 * The client is only created the first time a query is actually run, so
 * importing this module (during `next build`, for example) never requires a
 * reachable database. That keeps `next build` independent of DATABASE_URL and
 * lets the build succeed on platforms where the database is only reachable at
 * runtime.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
