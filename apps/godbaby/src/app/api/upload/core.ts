import { Bucket } from "upload-sdk";

export const filesSdk = new Bucket({
  R2_ACCESS_KEY: process.env.R2_ACCESS_KEY!,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
  R2_SECRET_KEY: process.env.R2_SECRET_KEY!,
});
