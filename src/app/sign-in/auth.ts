import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

const password = process.env.AUTH_PASSWORD!;
const secret = process.env.AUTH_SECRET!;

async function hash(s: string) {
  const msgUint8 = new TextEncoder().encode(s); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

export async function authenticate(
  userPassword: string
): Promise<Result<string>> {
  if (userPassword !== password) {
    return err("wrong password");
  }
  const passwordHash = await hash(password);

  const token = jwt.sign({ hash: passwordHash }, secret, {
    expiresIn: SEVEN_DAYS,
  });

  cookies().set({
    name: "token",
    value: token,
    httpOnly: true,
    expires: Date.now() + SEVEN_DAYS,
  });

  return ok(token);
}

type Result<T> = ReturnType<typeof ok<T>> | ReturnType<typeof err>;

function ok<T>(value: T) {
  return {
    isOk: true,
    value,
  } as const;
}

function err(message: string) {
  return {
    isOk: false,
    error: new Error(message),
  } as const;
}
