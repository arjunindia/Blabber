import { sqliteTable, text, blob, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey().notNull(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio", { length: 300 }),
  location: text("location"),
  website: text("website"),
  avatar: text("avatar"),
  createdAt: integer("createdAt", { mode: "number" })
    .notNull()
    .$defaultFn(() => Date.now()),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  verificationMessage: text("verificationMessage"),
});

export const user_key = sqliteTable("user_key", {
  id: text("id").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id),
  hashed_password: text("hashed_password"),
});

export const user_session = sqliteTable("user_session", {
  id: text("id").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id),
  active_expires: blob("id", { mode: "bigint" }).notNull(),
  idle_expires: blob("id", { mode: "bigint" }).notNull(),
});
