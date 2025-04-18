/// <reference types="express" />
import { Request } from '../types';
import { ResolvedRoute, RouteEntry } from './route-entry';
export interface RestRouter {
    /**
     * Add a route to the router
     * @param route - A route entry
     */
    add(route: RouteEntry): void;
    /**
     * Find a matching route for the given http request
     * @param request - Http request
     * @returns The resolved route, if not found, `undefined` is returned
     */
    find(request: Request): ResolvedRoute | undefined;
    /**
     * List all routes
     */
    list(): RouteEntry[];
}
export type RestRouterOptions = {
    /**
     * When `true` it uses trailing slash to match. (default: `false`)
     *
     * 1. `strict` is true:
     * - request `/orders` matches route `/orders` but not `/orders/`
     * - request `/orders/` matches route `/orders/` but not `/orders`
     *
     * 2. `strict` is false (default)
     * - request `/orders` matches route `/orders` first and falls back to `/orders/`
     * - request `/orders/` matches route `/orders/` first and falls back to `/orders`
     *
     * See `strict routing` at http://expressjs.com/en/4x/api.html#app
     */
    strict?: boolean;
};
