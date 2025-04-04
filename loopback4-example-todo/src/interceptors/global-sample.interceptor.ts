import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import { log } from 'console';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'globalSample'}})
export class GlobalSampleInterceptor implements Provider<Interceptor> {
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
      // console.log('Global interceptor invoked');
      // console.log('Invocation context:', invocationCtx);
      // console.log('Method name:', invocationCtx.methodName);
      // console.log('Arguments:', invocationCtx.args);
      // console.log('Target:', invocationCtx.target);
      
      const result = await next();
      // Add post-invocation logic here
      // console.log('Result:', result);
      return result;
    } catch (err) {
      // log('Error occurred:', err);
      // Add error handling logic here
      throw err;
    }
  }
}
