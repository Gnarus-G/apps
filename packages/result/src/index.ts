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

export type SplitResults<T, E> = [Array<Ok<T>>, Array<Err<E>>];

export namespace Result {
  export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result.isOk;
  }

  export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return !result.isOk;
  }

  export function split<T, E>(data: Array<Result<T, E>>): SplitResults<T, E> {
    return [data.filter(isOk), data.filter(isErr)];
  }

  export async function fromPromise<T>(
    p: Promise<T>
  ): Promise<Result<T, unknown>> {
    try {
      return ok(await p);
    } catch (e) {
      return err(e);
    }
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

  map<R>(mapper: (curr: T) => R): Result<R, E> {
    if (this.#dto.isOk) {
      return ok(mapper(this.#dto.value));
    }
    return err(this.#dto.error);
  }

  async mapAsyncsadf<R>(
    mapper: (curr: T) => Promise<R>
  ): Promise<Result<R, E>> {
    if (this.#dto.isOk) {
      return ok(await mapper(this.#dto.value));
    }
    return err(this.#dto.error);
  }

  ifOk<R>(thenCall: (curr: T) => Result<R, E>): Result<R, E> {
    if (this.#dto.isOk) {
      return thenCall(this.#dto.value);
    }
    return err(this.#dto.error);
  }
}

class Ok<T> extends ResultImpl<T, never> {
  isOk: true = true;
  constructor(public value: T) {
    super({
      isOk: true,
      value,
    });
  }
}

class Err<E> extends ResultImpl<never, E> {
  isOk: false = false;
  constructor(public error: E) {
    super({
      isOk: false,
      error,
    });
  }
}

export function ok(): Result<void, never>;
export function ok<T>(value: T): Result<T, never>;
export function ok<T>(value?: T): Result<T | void, never> {
  if (value !== undefined && arguments.length > 0) {
    return new Ok(value);
  }

  return new Ok(undefined);
}

export function err<E>(error: E): Result<never, E> {
  return new Err(error);
}
