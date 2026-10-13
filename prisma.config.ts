import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "prisma/config";

function loadDotEnvLocal(): void {
  if (process.env["DATABASE_URL"]) return;
  const envPath = join(__dirname, ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const match = /^\s*DATABASE_URL\s*=\s*(.*)\s*$/.exec(line);
    if (match) {
      let value = match[1].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env["DATABASE_URL"] = value;
      return;
    }
  }
}

loadDotEnvLocal();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
