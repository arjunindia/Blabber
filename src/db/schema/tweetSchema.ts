import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const todos = sqliteTable("tweets", {
  id: text("id").$defaultFn(createId).primaryKey(),
  content: text("content", { length: 300 }).notNull(),
  replyTo: text("replyTo", { length: 25 }),
  authorId: text("authorId", { length: 25 }).notNull(),
  createdAt: integer("createdAt", { mode: "number" })
    .$defaultFn(() => Date.now())
    .notNull(),
  image: text("image", { length: 300 }),
  likes: integer("likes", { mode: "number" }).notNull().default(0),
  isRetweet: integer("isRetweet", { mode: "boolean" }).notNull().default(false),
  retweetOf: text("retweetOf", { length: 25 }),
  retweets: integer("retweets", { mode: "number" }).notNull().default(0),
});
export type TodoInsert = InferInsertModel<typeof todos>;
export type TodoSelect = InferSelectModel<typeof todos>;
