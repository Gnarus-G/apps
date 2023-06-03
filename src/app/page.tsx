import Image from "next/image";
import Upload from "./components/Upload";
import { PicturesTable, db } from "./lib/drizzle";

export default async function Home() {
  const pictures = await db.select().from(PicturesTable);

  return (
    <>
      <header className="text-center pt-24">
        <h1 className="text-3xl">Nuri</h1>
        <p className="text-xl">The best goddaughter</p>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between pt-24 ">
        <section
          id="pics"
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full px-5 md:px-64 lg:px-96"
        >
          {pictures.map((pic) => (
            <article key={pic.id} className="relative aspect-square">
              <Image
                className="object-cover rounded"
                src={pic.url}
                alt="Nuri"
                fill
                sizes="(max-width: 768px) 90vw, 300px"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
              />
            </article>
          ))}
        </section>
        <aside className="sticky bottom-0 mt-5 w-full">
          <Upload />
        </aside>
      </main>
    </>
  );
}
