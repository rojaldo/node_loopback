import { Context } from './context';
import { InvocationArgs, InvocationSource } from './invocation';
import { ResolutionSession } from './resolution-session';
import { ValueOrPromise } from './value-promise';
/**
 * Create the Promise type for `T`. If `T` extends `Promise`, the type is `T`,
 * otherwise the type is `ValueOrPromise<T>`.
 */
export type AsValueOrPromise<T> = T extends Promise<unknown> ? T : ValueOrPromise<T>;
/**
 * The intercepted variant of a function to return `ValueOrPromise<T>`.
 * If `T` is not a function, the type is `T`.
 */
export type AsInterceptedFunction<T> = T extends (...args: InvocationArgs) => infer R ? (...args: Parameters<T>) => AsValueOrPromise<R> : T;
/**
 * The proxy type for `T`. The return type for any method of `T` with original
 * return type `R` becomes `ValueOrPromise<R>` if `R` does not extend `Promise`.
 * Property types stay untouched.
 *
 * @example
 * ```ts
 * class MyController {
 *   name: string;
 *
 *   greet(name: string): string {
 *     return `Hello, ${name}`;
 *   }
 *
 *   async hello(name: string) {
 *     return `Hello, ${name}`;
 *   }
 * }
 * ```
 *
 * `AsyncProxy<MyController>` will be:
 * ```ts
 * {
 *   name: string; // the same as MyController
 *   greet(name: string): ValueOrPromise<string>; // the return type becomes `ValueOrPromise<string>`
 *   hello(name: string): Promise<string>; // the same as MyController
 * }
 * ```
 */
export type AsyncProxy<T> = {
    [P in keyof T]: AsInterceptedFunction<T[P]>;
};
/**
 * Invocation source for injected proxies. It wraps a snapshot of the
 * `ResolutionSession` that tracks the binding/injection stack.
 */
export declare class ProxySource implements InvocationSource<ResolutionSession> {
    readonly value: ResolutionSession;
    type: string;
    constructor(value: ResolutionSession);
    toString(): string;
}
/**
 * A proxy handler that applies interceptors
 *
 * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 */
export declare class InterceptionHandler<T extends object> implements ProxyHandler<T> {
    private context;
    private session?;
    private source?;
    constructor(context?: Context, session?: ResolutionSession | undefined, source?: InvocationSource<unknown> | undefined);
    get(target: T, propertyName: PropertyKey, receiver: unknown): any;
}
/**
 * Create a proxy that applies interceptors for method invocations
 * @param target - Target class or object
 * @param context - Context object
 * @param session - Resolution session
 * @param source - Invocation source
 */
export declare function createProxyWithInterceptors<T extends object>(target: T, context?: Context, session?: ResolutionSession, source?: InvocationSource): AsyncProxy<T>;
