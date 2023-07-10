"use client";
import { uploadFiles } from "upload-sdk";
import { newPictures } from "../actions";

export default function Upload() {
  return (
    <>
      <label
        role="button"
        tabIndex={0}
        className="bg-blue-500 hover:bg-blue-600 rounded-lg p-2 transition active:scale-95"
      >
        Choose files
        <input
          hidden
          type="file"
          required
          multiple
          accept="image/*"
          onChange={async (e) => {
            const files = Array.from(e.target.files!);
            const [uploadUrls, failedUrls] = await uploadFiles(files);

            const urls = uploadUrls.map((r) => ({ url: r.value.url }));

            if (urls.length) {
              await newPictures(urls);
            }

            failedUrls.forEach((r) => console.error("failed to upload", r));
          }}
        />
      </label>
    </>
  );
}
