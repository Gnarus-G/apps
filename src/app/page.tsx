import Image from "next/image";
import Upload from "./components/Upload";
import { PicturesTable, db } from "./lib/drizzle";

export default async function Home() {
  const pictures = await db.select().from(PicturesTable);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Upload />
      {pictures.map((pic) => (
        <Image key={pic.id} src={pic.url} width={100} height={100} alt="Nuri" />
      ))}
    </main>
  );
}
