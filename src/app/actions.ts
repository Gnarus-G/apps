"use server";
import { revalidatePath } from "next/cache";
import { NewPicture, PicturesTable, db } from "./lib/drizzle";

export async function newPictures(values: NewPicture[]) {
  const r = await db.insert(PicturesTable).values(values).returning();
  revalidatePath("/");
  return r;
}
