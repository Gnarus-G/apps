type ResultState<T, E> = OkState<T> | ErrState<E>;

type OkState<T> = {
  isOk: true;
  value: T;
};

type ErrState<E> = {
  isOk: false;
  error: E;
};

export type SplitResults<T, E> = [Array<Ok<T>>, Array<Err<E>>];

export abstract class Result<T, E> {
  constructor(public readonly state: ResultState<T, E>) {
    Object.freeze(this.state);
  }

  static ok(): Ok<void>;
  static ok<T>(value: T): Ok<T>;
  static ok<T>(value?: T): Ok<T | void> {
    if (value !== undefined && arguments.length > 0) {
      return new Ok(value);
    }

    return new Ok(undefined);
  }

  static err<E>(error: E): Err<E> {
    return new Err(error);
  }

  static make<T, E>(
    factory: (
      okFn: (value: T) => Ok<T>,
      errFn: (error: E) => Err<E>
    ) => Result<T, E>
  ) {
    return factory(this.ok, this.err);
  }

  static async makeAsync<T, E>(
    factory: (
      okFn: typeof this.ok,
      errFn: typeof this.err
    ) => Promise<Result<T, E>>
  ) {
    return factory(this.ok, this.err);
  }

  static isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result instanceof Ok;
  }

  static isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return result instanceof Err;
  }

  static split<T, E>(data: Array<Result<T, E>>): SplitResults<T, E> {
    return [data.filter(this.isOk), data.filter(this.isErr)];
  }

  static async fromPromise<T>(p: Promise<T>): Promise<Result<T, unknown>> {
    try {
      return new Ok(await p);
    } catch (e) {
      return new Err(e);
    }
  }

  expect(message: string): T {
    if (!this.state.isOk) {
      throw new ResultUnwrapError(message, this.state.error);
    }
    return this.state.value;
  }

  unwrap(): T {
    return this.expect(
      `tried and failed to unwrap an Result of the Err variant`
    );
  }

  unwrapOrElse<R extends T>(f: (e: E) => R): T {
    if (!this.state.isOk) {
      return f(this.state.error);
    }
    return this.state.value;
  }

  map<R>(mapper: (curr: T) => R): Result<R, E> {
    if (this.state.isOk) {
      return new Ok(mapper(this.state.value));
    }
    return new Err(this.state.error);
  }

  async mapAsync<R>(mapper: (curr: T) => Promise<R>): Promise<Result<R, E>> {
    if (this.state.isOk) {
      return new Ok(await mapper(this.state.value));
    }
    return new Err(this.state.error);
  }

  /**
   * Calls `operation` if the result is {@link Ok}, otherwise
   * returns {@link Err} for it.
   *
   * @param operation after
   *
   */
  andThen<R>(operation: (curr: T) => Result<R, E>): Result<R, E> {
    if (this.state.isOk) {
      return operation(this.state.value);
    }
    return new Err(this.state.error);
  }

  flatten(): Result<ExtractOkValue<T>, E> {
    if (this.state.isOk) {
      const value = this.state.value;
      if (value instanceof Result) {
        return this.andThen((_) => value);
      }
    }

    return this as any;
  }
}

type ExtractOkValue<T> = T extends Result<infer D, unknown> ? D : T;

class ResultUnwrapError extends Error {
  constructor(message: string, public cause: unknown) {
    super(message);
  }
}

class Ok<T> extends Result<T, never> {
  constructor(value: T) {
    super({
      isOk: true,
      value,
    });
  }

  /**
   * This is perfectly safe, as we're on an {@link Ok} variant
   * of {@link Result}
   */
  unwrap(): T {
    return (this.state as OkState<T>).value;
  }
}

class Err<E> extends Result<never, E> {
  constructor(error: E) {
    super({
      isOk: false,
      error,
    });
  }

  /**
   * THIS WILL THROW AN ERROR!
   * @throws ResultUnwrapError
   */
  unwrap(): never {
    return super.unwrap();
  }
}
