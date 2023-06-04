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

export function signToken<T extends object>(
  payload: T,
  expiresIn: string | number = SEVEN_DAYS
) {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
}

export function verifyEmailToken(token: string): Result<true> {
  try {
    const s = jwt.verify(token, secret) as { forEmail: boolean };
    if (s.forEmail) {
      return ok(true);
    }
    return err("provided token not intended for email verification");
  } catch (e) {
    console.error(e);
    return err("token failed verification");
  }
}

export async function authenticatePassword(
  userPassword: string
): Promise<Result<string>> {
  if (userPassword !== password) {
    return err("wrong password");
  }
  return authenticate();
}

export async function authenticate(): Promise<Result<string>> {
  const passwordHash = await hash(password);

  const token = signToken({ hash: passwordHash });

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
