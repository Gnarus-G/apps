"use client";
import Image from "next/image";
import React, { useRef } from "react";
import { Picture } from "../lib/drizzle";

export default function Picture({ url: src, createdAt }: Picture) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <article
        className="relative aspect-square"
        role="button"
        tabIndex={0}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            ref.current?.showModal();
          }
        }}
        onClick={() => ref.current?.showModal()}
      >
        <Image
          className="object-cover rounded"
          src={src}
          alt="Nuri"
          fill
          sizes="(max-width: 768px) 90vw, 300px"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
        />
      </article>
      <dialog ref={ref} className="w-full h-full lg:w-1/2">
        <div className="relative h-full flex flex-col">
          <h1 className="sticky">
            uploaded {new Date(createdAt).toLocaleString(undefined)}
          </h1>
          <div className="relative w-full aspect-square my-auto">
            <Image
              className="object-contain"
              src={src}
              alt="Nuri"
              fill
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
            />
          </div>
          <div className="sticky mt-auto bottom-0 right-0 px-5 py-2">
            <button
              className="float-right"
              onClick={() => ref.current?.close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
