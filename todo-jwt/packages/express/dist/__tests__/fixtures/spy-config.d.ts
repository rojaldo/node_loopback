export type SpyAction = 'log' | 'mock' | 'reject';
/**
 * Configuration for `spy` middleware
 */
export interface SpyConfig {
    /**
     * Action for the spy to enforce
     * - `log`: set `x-spy-log` http response header and proceed with the
     * invocation
     * - `mock`: set `x-spy-mock` http response header and return a mock response
     * without calling the target
     * - `reject`: set `x-spy-reject` http response header and reject the request
     * with 400 status code
     */
    action: SpyAction;
}
