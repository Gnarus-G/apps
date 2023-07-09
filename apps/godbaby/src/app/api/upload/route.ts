import { createUploadHandler } from "upload-sdk";

export const POST = createUploadHandler({
  R2_ACCESS_KEY: process.env.R2_ACCESS_KEY!,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
  R2_SECRET_KEY: process.env.R2_SECRET_KEY!,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME!,
  R2_BUCKET_URL: process.env.NEXT_PUBLIC_R2_BUCKET_URL!,
});
