export type Result<T, E extends Error = Error> = ResultDto<T, E> &
  ResultImpl<T, E>;

type ResultDto<T, E extends Error = Error> =
  | { isOk: true; value: T }
  | {
      isOk: false;
      error: E;
    };

class ResultImpl<T, E extends Error = Error> {
  constructor(private readonly inner: ResultDto<T, E>) {}

  unwrap() {
    if (!this.inner.isOk) {
      throw this.inner.error;
    }
    return this.inner.value;
  }
}

export function ok<T>(value: T): Result<T, Error> {
  const result = {
    isOk: true,
    value,
  } as const;

  return Object.assign(result, new ResultImpl(result));
}

export function err<E extends Error>(e: E): Result<never, E>;
export function err(message: string): Result<never>;
export function err(error: Error | string): Result<never> {
  if (typeof error === "string") {
    error = new Error(error);
  }

  const r = {
    isOk: false,
    error,
  } as const;

  return Object.assign(new ResultImpl<never>(r), r);
}
