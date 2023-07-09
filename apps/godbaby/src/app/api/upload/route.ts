import { NextResponse } from "next/server";

import { Client } from "upload-sdk";

const client = new Client({
  R2_ACCESS_KEY: process.env.R2_ACCESS_KEY!,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
  R2_SECRET_KEY: process.env.R2_SECRET_KEY!,
});

export async function POST(request: Request) {
  const res = await request.json();

  return NextResponse.json({ res });
}
