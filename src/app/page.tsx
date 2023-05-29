import Upload from "./components/Upload";
import { PicturesTable, db } from "./lib/drizzle";

export default async function Home() {
  const pictures = await db.select().from(PicturesTable);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Upload />
    </main>
  );
}
