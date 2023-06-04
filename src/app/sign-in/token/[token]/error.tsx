"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center">
      <p className="text-yellow-100">Unrecognized or expired token</p>
      <br />
      <Link href="/sign-in">Sign In</Link>
    </div>
  );
}
