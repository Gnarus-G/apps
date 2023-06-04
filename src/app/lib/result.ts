export type Result<T, E> = ResultDto<T, E> & ResultImpl<T, E>;

type ResultDto<T, E> =
  | { isOk: true; value: T }
  | {
      isOk: false;
      error: E;
    };

class ResultImpl<T, E> {
  constructor(private readonly inner: ResultDto<T, E>) {}

  unwrap() {
    if (!this.inner.isOk) {
      throw this.inner.error;
    }
    return this.inner.value;
  }
}

export function ok<T>(value: T): Result<T, never> {
  const result = {
    isOk: true,
    value,
  } as const;

  return Object.assign(result, new ResultImpl<T, never>(result));
}

export function err<E>(error: E): Result<never, E> {
  const r = {
    isOk: false,
    error,
  } as const;

  return Object.assign(new ResultImpl<never, E>(r), r);
}

export function wrap<P extends unknown[], R>(
  f: (...args: P) => R
): (...args: P) => Result<R, unknown> {
  return (...a) => {
    try {
      return ok(f(...a));
    } catch (e) {
      return err(e);
    }
  };
}
