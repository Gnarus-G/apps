import { Result, SplitResults, err, ok } from "result";
import { PresignedUploads } from "./types";

export async function uploadFiles(
  files: File[]
): Promise<SplitResults<PresignedUploads[string], File>> {
  const uploadUrls = await preUpload(files);

  const urls = uploadUrls.expect("failed to get presigned urls");

  const data = await Promise.all(
    files.map(async (file) => {
      const data = urls[file.name];
      const res = await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (res.ok) {
        return ok(data);
      }

      return err(file);
    })
  );

  return Result.split(data);
}

async function preUpload(
  files: File[]
): Promise<Result<PresignedUploads, unknown>> {
  const result = await Result.fromPromise(
    fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        files: files.map((f) => ({ name: f.name, type: f.type })),
      }),
    })
  );

  const r = result.expect("failed to fetch /api/upload");

  return r.ok ? ok((await r.json()) as PresignedUploads) : err(await r.json());
}
