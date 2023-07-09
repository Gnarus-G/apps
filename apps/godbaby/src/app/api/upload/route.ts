import { filesSdk } from "./core";

export const POST = filesSdk.createUploadHandler({
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME!,
  R2_BUCKET_URL: process.env.NEXT_PUBLIC_R2_BUCKET_URL!,
});
