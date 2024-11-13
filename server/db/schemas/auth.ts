import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { commentsTable } from "./comments";
import { postsTable } from "./posts";
import { commentUpvotesTable, postUpvotesTable } from "./upvotes";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const userRatlations = relations(userTable, ({ many }) => ({
  posts: many(postsTable, { relationName: "author" }),
  comments: many(commentsTable, { relationName: "author" }),
  postUpvotes: many(postUpvotesTable, { relationName: "user" }),
  commentUpvotes: many(commentUpvotesTable, { relationName: "user" }),
}));

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
