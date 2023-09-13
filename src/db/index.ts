import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import * as schema from "./schema/todoSchema.ts";
import * as tweetSchema from "./schema/tweetSchema.ts";

const fullSchema = {
  ...schema,
  ...tweetSchema,
};

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema: fullSchema, logger: true });
