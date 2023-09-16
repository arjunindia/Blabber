import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { user } from "./userSchema";

export const tweets = sqliteTable("tweets", {
  id: text("id").$defaultFn(createId).primaryKey().notNull(),
  content: text("content", { length: 300 }).notNull(),
  replyTo: text("replyTo", { length: 25 }),
  authorId: text("authorId", { length: 25 })
    .notNull()
    .references(() => user.id),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  image: text("image"),
  likes: integer("likes", { mode: "number" }).notNull().default(0),
  isRetweet: integer("isRetweet", { mode: "boolean" }).notNull().default(false),
  retweetOf: text("retweetOf", { length: 25 }),
  retweets: integer("retweets", { mode: "number" }).notNull().default(0),
});

export const tweetLikes = sqliteTable("tweetLikes", {
  id: text("id").primaryKey().notNull(),
  tweetId: text("tweetId", { length: 25 })
    .notNull()
    .references(() => tweets.id),
  userId: text("userId", { length: 25 })
    .notNull()
    .references(() => user.id),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type TweetInsert = InferInsertModel<typeof tweets>;
export type TweetSelect = InferSelectModel<typeof tweets>;
