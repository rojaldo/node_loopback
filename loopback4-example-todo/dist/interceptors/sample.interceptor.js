"use strict";
var SampleInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleInterceptor = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
let SampleInterceptor = SampleInterceptor_1 = class SampleInterceptor {
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
            console.log(`Intercepting ${invocationCtx.targetName}.${invocationCtx.methodName}`);
            const result = await next();
            // Add post-invocation logic here
            console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        }
        catch (err) {
            // Add error handling logic here
            throw err;
        }
    }
};
exports.SampleInterceptor = SampleInterceptor;
SampleInterceptor.BINDING_KEY = `interceptors.${SampleInterceptor_1.name}`;
exports.SampleInterceptor = SampleInterceptor = SampleInterceptor_1 = tslib_1.__decorate([
    (0, core_1.injectable)({ tags: { key: SampleInterceptor.BINDING_KEY } })
], SampleInterceptor);
//# sourceMappingURL=sample.interceptor.js.map