/**
 * Exposes the promise executor callbacks (resolve, reject).
 */
export default class Deferred<A> {
  promise: Promise<A>;
  constructor(val: any) {
    this.val = val
    this.promise = new Promise((resolve, reject) => {
      this.resolve = value => {
        resolve(value);
        return this.promise;
      };
      this.reject = reason => {
        reject(reason);
        return this.promise;
      };
    });
  }
}

/**
 * Interface representing a deferred
 */
export default interface Deferred<A> {
  val: any;
  resolve(value?: A | PromiseLike<A>): Promise<A>;
  reject(reason?: string | Error): Promise<A>;
}
