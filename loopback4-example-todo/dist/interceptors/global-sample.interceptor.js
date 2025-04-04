"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalSampleInterceptor = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
let GlobalSampleInterceptor = class GlobalSampleInterceptor {
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
    async intercept(invocationCtx, next) {
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
        }
        catch (err) {
            // log('Error occurred:', err);
            // Add error handling logic here
            throw err;
        }
    }
};
exports.GlobalSampleInterceptor = GlobalSampleInterceptor;
exports.GlobalSampleInterceptor = GlobalSampleInterceptor = tslib_1.__decorate([
    (0, core_1.globalInterceptor)('', { tags: { name: 'globalSample' } })
], GlobalSampleInterceptor);
//# sourceMappingURL=global-sample.interceptor.js.map