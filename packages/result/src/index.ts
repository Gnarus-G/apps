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

export abstract class Result<T, E> {
  readonly #dto: ResultDto<T, E>;

  constructor(dto: ResultDto<T, E>) {
    this.#dto = dto;
  }

  abstract deref(): ResultDto<T, E>;

  expect(message: string): T {
    if (!this.#dto.isOk) {
      throw new UnwrapError(message, this.#dto.error);
    }
    return this.#dto.value;
  }

  unwrap(): T {
    return this.expect(
      `tried and failed to unwrap an Result of the Err variant`
    );
  }

  unwrapOrElse<R extends T>(f: (e: E) => R): T {
    if (!this.#dto.isOk) {
      return f(this.#dto.error);
    }
    return this.#dto.value;
  }

  map<R>(mapper: (curr: T) => R): Result<R, E> {
    if (this.#dto.isOk) {
      return new Ok(mapper(this.#dto.value));
    }
    return new Err(this.#dto.error);
  }

  async mapAsyncsadf<R>(
    mapper: (curr: T) => Promise<R>
  ): Promise<Result<R, E>> {
    if (this.#dto.isOk) {
      return new Ok(await mapper(this.#dto.value));
    }
    return new Err(this.#dto.error);
  }

  ifOk<R>(thenCall: (curr: T) => Result<R, E>): Result<R, E> {
    if (this.#dto.isOk) {
      return thenCall(this.#dto.value);
    }
    return new Err(this.#dto.error);
  }
}

export namespace Result {
  function ok(): Result<void, never>;
  function ok<T>(value: T): Result<T, never>;
  function ok<T>(value?: T): Result<T | void, never> {
    if (value !== undefined && arguments.length > 0) {
      return new Ok(value);
    }

    return new Ok(undefined);
  }

  function err<E>(error: E): Result<never, E> {
    return new Err(error);
  }

  export function make<T, E>(
    factory: (okFn: typeof ok, errFn: typeof err) => Result<T, E>
  ) {
    return factory(ok, err);
  }

  export async function makeAsync<T, E>(
    factory: (okFn: typeof ok, errFn: typeof err) => Promise<Result<T, E>>
  ) {
    return factory(ok, err);
  }

  export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result instanceof Ok;
  }

  export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return result instanceof Err;
  }

  export function deref<T, E>(result: Result<T, E>): ResultDto<T, E> {
    return result.deref();
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

class UnwrapError extends Error {
  constructor(message: string, public cause: unknown) {
    super(message);
  }
}

class Ok<T> extends Result<T, never> {
  constructor(public value: T) {
    super({
      isOk: true,
      value,
    });
  }

  deref(): OkDto<T> {
    return {
      isOk: true,
      value: this.value,
    };
  }
}

class Err<E> extends Result<never, E> {
  constructor(public error: E) {
    super({
      isOk: false,
      error,
    });
  }

  deref(): ErrDto<E> {
    return {
      isOk: false,
      error: this.error,
    };
  }
}
