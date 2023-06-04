"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl mb-3">Something went wrong!</h2>
      <button className="float-right" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
