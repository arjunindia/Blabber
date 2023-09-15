import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema/todoSchema.ts";
import * as tweetSchema from "./schema/tweetSchema.ts";
import * as userSchema from "./schema/userSchema.ts";
const fullSchema = {
  ...schema,
  ...tweetSchema,
  ...userSchema,
};

export const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema: fullSchema, logger: true });
