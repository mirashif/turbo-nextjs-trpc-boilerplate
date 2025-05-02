import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const redacted = (str: string) => {
  return str
    .replace(/:\/\/(.*?):(.*?)@/, "://***:***@")
    .replace(/@(.+?):/, "@***:");
};

const databaseUrl = `${process.env.DATABASE_URL}`;

console.log(`initializing db with ${redacted(databaseUrl)}`);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
