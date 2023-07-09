import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const PicturesTable = pgTable(
  "pictures",
  {
    id: serial("id").primaryKey(),
    url: text("url").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.url),
    };
  }
);

export type Picture = InferModel<typeof PicturesTable>;
export type NewPicture = InferModel<typeof PicturesTable, "insert">;

// Connect to Vercel Postgres
export const db = drizzle(sql);
