export type Result<T, E> = Ok<T> | Err<E>;

type Ok<T> = {
  isOk: true;
  data: T;
} & OKResult<T>;

type Err<E> = {
  isOk: false;
  error: E;
} & ErrResult<E>;

export namespace Result {
  export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result.isOk;
  }

  export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return !result.isOk;
  }

  export function split<T, E>(
    data: Array<Result<T, E>>
  ): [Array<Ok<T>>, Array<Err<E>>] {
    return [data.filter(isOk), data.filter(isErr)];
  }
}

class OKResult<T> implements Ok<T> {
  isOk: true = true;
  constructor(public data: T) {}

  unwrap() {
    return this.data;
  }

  unwrapOrElse() {
    return this.unwrap();
  }
}

class ErrResult<E> implements Err<E> {
  isOk: false = false;
  constructor(public error: E) {}

  unwrap(): never {
    throw this.error;
  }

  unwrapOrElse<R>(f: (e: E) => R): R {
    return f(this.error);
  }
}

export function ok(): Result<void, never>;
export function ok<T>(value: T): Result<T, never>;
export function ok<T>(value?: T): Result<T | void, never> {
  if (value !== undefined && arguments.length > 0) {
    return new OKResult(value);
  }
  return new OKResult(undefined);
}

export function err<E>(data: E): Result<never, E> {
  return new ErrResult(data);
}
