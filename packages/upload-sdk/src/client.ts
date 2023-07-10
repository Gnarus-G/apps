import { Result, err, ok } from "result";
import { PresignedUploads } from "./types";

export async function uploadFiles(
  files: File[]
): Promise<ReturnType<typeof Result.split<PresignedUploads[string], File>>> {
  const uploadUrls = await preUpload(files);

  const urls = uploadUrls.unwrapOrElse(() => {
    throw new Error("failed to get presigned urls");
  });

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

async function preUpload(files: File[]) {
  return await handle<PresignedUploads>(
    fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        files: files.map((f) => ({ name: f.name, type: f.type })),
      }),
    })
  );
}

async function handle<D>(p: Promise<Response>): Promise<Result<D, unknown>> {
  const res = await p;
  try {
    if (res.ok) {
      return ok(await res.json());
    }

    return err(await res.json());
  } catch (e) {
    console.error("[Upload SDK - Client]", "something went wrong with data", e);
    return err("bad data");
  }
}
