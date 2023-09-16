import { db, client } from "../../db";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { env } from "bun";
import { lucia } from "lucia";
import { web } from "lucia/middleware";

// expect error (see next section)
export const auth = lucia({
  adapter: libsql(client, {
    user: "user",
    key: "user_key",
    session: "user_session",
  }),
  middleware: web(),
  env: env.NODE_ENV === "production" ? "PROD" : "DEV",
  // "PROD" if deployed to HTTPS
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: (data) => {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
    };
  },
});
export type Auth = typeof auth;
