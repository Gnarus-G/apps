import { Result } from "result";
import { PresignedUploads } from "./types";

export async function uploadFiles(files: File[]) {
  const uploadUrls = await preUpload(files);

  const urls = uploadUrls.expect("failed to get presigned urls");

  const data = await Promise.all(
    files.map(async (file) => {
      const data = urls[file.name];
      const res = await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
      });

      return Result.make((ok, err) => (res.ok ? ok(data) : err(file)));
    })
  );

  return Result.split(data);
}

async function preUpload(files: File[]) {
  const result = await Result.fromPromise(
    fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        files: files.map((f) => ({ name: f.name, type: f.type })),
      }),
    })
  );

  const r = result.expect("failed to fetch /api/upload");

  return Result.makeAsync(async (ok, err) => {
    return r.ok
      ? ok((await r.json()) as PresignedUploads)
      : err(await r.json());
  });
}
