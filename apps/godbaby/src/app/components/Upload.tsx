"use client";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { OurFileRouter } from "../api/uploadthing/core";
import { newPictures } from "../actions";

export default function Upload() {
  return (
    <>
      {/* <UploadButton<OurFileRouter> */}
      {/*   endpoint="imageUploader" */}
      {/*   onClientUploadComplete={async (res) => { */}
      {/*     if (!res) return; */}
      {/*     newPictures(res.map((r) => ({ url: r.fileUrl }))); */}
      {/*   }} */}
      {/*   onUploadError={(error: Error) => { */}
      {/*     console.error(error); */}
      {/*   }} */}
      {/* /> */}

      <label role="button" className="bg-blue-500 rounded-lg p-2">
        Choose files
        <input
          hidden
          type="file"
          required
          multiple
          accept="image/*"
          onChange={async (e) => {
            const files = Array.from(e.target.files!);
            const uploadUrls = await preUpload(files);

            await Promise.all(
              files.map((file) =>
                fetch(uploadUrls[file.name].uploadUrl, {
                  method: "PUT",
                  body: file,
                })
              )
            );

            await newPictures(
              files.map((f) => ({ url: uploadUrls[f.name].url }))
            );
          }}
        />
      </label>
    </>
  );
}

async function preUpload(
  files: File[]
): Promise<Record<string, { uploadUrl: string; url: string }>> {
  const data = await fetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({
      files: files.map((f) => ({ name: f.name, type: f.type })),
    }),
  }).then((r) => r.json());

  console.log("asdf", data);

  return data.files;
}
