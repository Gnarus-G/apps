"use client";
import { PresignedUploads } from "upload-sdk/dist/types";
import { newPictures } from "../actions";

export default function Upload() {
  return (
    <>
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

async function preUpload(files: File[]): Promise<PresignedUploads> {
  const data = await fetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({
      files: files.map((f) => ({ name: f.name, type: f.type })),
    }),
  }).then((r) => r.json());

  return data;
}
