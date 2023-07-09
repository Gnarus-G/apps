"use server";
import { revalidatePath } from "next/cache";
import { NewPicture, PicturesTable, db } from "./lib/drizzle";
import { eq } from "drizzle-orm";
import { filesSdk } from "./api/upload/core";

export async function newPictures(values: NewPicture[]) {
  const r = await db.insert(PicturesTable).values(values).returning();
  revalidatePath("/");
  return r;
}

export async function deletePictures(id: number, url: string) {
  await db.delete(PicturesTable).where(eq(PicturesTable.id, id));

  if (
    new URL(url).origin ===
    new URL(process.env.NEXT_PUBLIC_R2_BUCKET_URL!).origin
  ) {
    await filesSdk.deleteByFileUrl(new URL(url), process.env.R2_BUCKET_NAME!);
  }
  revalidatePath("/");
}
