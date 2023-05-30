"use server";
import { NewPicture, PicturesTable, db } from "./lib/drizzle";

export async function newPictures(values: NewPicture[]) {
  return await db.insert(PicturesTable).values(values).returning();
}
