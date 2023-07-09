import { NextResponse } from "next/server";

import { Client } from "upload-sdk";

const client = new Client({
  R2_ACCESS_KEY: process.env.R2_ACCESS_KEY!,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
  R2_SECRET_KEY: process.env.R2_SECRET_KEY!,
});

export async function POST(request: Request) {
  const data = await request.json();

  const res = await client.presign({
    bucketName: process.env.R2_BUCKET_NAME!,
    files: data.files,
  });

  const files = res.files.map((f) => ({
    name: f.name,
    url: `${process.env.NEXT_PUBLIC_R2_BUCKET_URL}/${f.key}`,
    key: f.key,
    uploadUrl: f.presignedUrl,
  }));

  return NextResponse.json({
    files: Object.fromEntries(files.map(({ name, ...f }) => [name, f])),
  });
}
