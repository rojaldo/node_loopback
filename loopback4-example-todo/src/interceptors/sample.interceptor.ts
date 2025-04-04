import {
  /* inject, */
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: SampleInterceptor.BINDING_KEY}})
export class SampleInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${SampleInterceptor.name}`;

  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      console.log(`Intercepting ${invocationCtx.targetName}.${invocationCtx.methodName}`);
      
      const result = await next();
      // Add post-invocation logic here
      console.log(`Result of ${invocationCtx.targetName}.${invocationCtx.methodName}:`, result);
      return result;
    } catch (err) {
      console.error(`Error occurred in ${invocationCtx.targetName}.${invocationCtx.methodName}:`, err);
      // Add error handling logic here
      throw err;
    }
  }
}
