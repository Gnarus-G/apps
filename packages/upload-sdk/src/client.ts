import { PresignedUploads } from "./types";

export async function uploadFiles(
  files: File[]
): Promise<Result<PresignedUploads[string], File>[]> {
  const uploadUrls = await preUpload(files);

  if (!uploadUrls.isOk) {
    throw new Error("failed to get presigned urls");
  }

  return await Promise.all(
    files.map(async (file) => {
      const data = uploadUrls.data[file.name];
      const res = await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (res.ok) {
        return {
          isOk: true,
          data,
        };
      }

      return {
        isOk: false,
        error: file,
      };
    })
  );
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
      return {
        isOk: true,
        data: await res.json(),
      };
    }

    return {
      isOk: false,
      error: await res.json(),
    };
  } catch (e) {
    console.error("[Upload SDK - Client]", "something went wrong with data", e);
    return {
      isOk: false,
      error: "bad data",
    };
  }
}

type Result<T, E> = Ok<T> | Err<E>;

type Ok<T> = {
  isOk: true;
  data: T;
};

type Err<E> = {
  isOk: false;
  error: E;
};
