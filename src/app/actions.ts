"use server";
import { revalidatePath } from "next/cache";
import { NewPicture, PicturesTable, db } from "./lib/drizzle";
import { eq } from "drizzle-orm";

export async function newPictures(values: NewPicture[]) {
  const r = await db.insert(PicturesTable).values(values).returning();
  revalidatePath("/");
  return r;
}

export async function deletePictures(id: number) {
  await db.delete(PicturesTable).where(eq(PicturesTable.id, id));
  revalidatePath("/");
}
