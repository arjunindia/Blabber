import type { Config } from "drizzle-kit";
import env from "dotenv";

env.config();
export default {
  schema: "./src/db/schema/*.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
  out: "./src/db/generated",
} satisfies Config;
