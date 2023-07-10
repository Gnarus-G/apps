export type Result<T, E> = ResultDto<T, E> & ResultImpl<T, E>;

type ResultDto<T, E> = OkDto<T> | ErrDto<E>;

type OkDto<T> = {
  isOk: true;
  value: T;
};

type ErrDto<E> = {
  isOk: false;
  error: E;
};

type Ok<T> = OkDto<T> & ResultImpl<T, never>;
type Err<E> = ErrDto<E> & ResultImpl<never, E>;

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

class ResultImpl<T, E> {
  #dto: ResultDto<T, E>;

  constructor(dto: ResultDto<T, E>) {
    this.#dto = dto;
  }

  unwrap(): T {
    if (!this.#dto.isOk) {
      throw this.#dto.error;
    }
    return this.#dto.value;
  }

  unwrapOrElse<R extends T>(f: (e: E) => R): T {
    if (!this.#dto.isOk) {
      return f(this.#dto.error);
    }
    return this.#dto.value;
  }
}

export function ok(): Result<void, never>;
export function ok<T>(value: T): Result<T, never>;
export function ok<T>(value?: T): Result<T | void, never> {
  if (value !== undefined && arguments.length > 0) {
    const result = {
      isOk: true,
      value,
    } as const;

    return Object.assign(result, new ResultImpl<T, never>(result));
  }

  const result = {
    isOk: true,
    value: undefined,
  } as const;

  return Object.assign(result, new ResultImpl<void, never>(result));
}

export function err<E>(error: E): Result<never, E> {
  const result = {
    isOk: false,
    error,
  } as const;

  return Object.assign(new ResultImpl<never, E>(result), result);
}
