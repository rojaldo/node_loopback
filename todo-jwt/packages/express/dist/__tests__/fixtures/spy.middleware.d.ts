import { ExpressMiddlewareFactory } from '../..';
import { SpyConfig } from './spy-config';
/**
 * An Express middleware factory function that creates a handler to spy on
 * requests
 */
declare const spyMiddlewareFactory: ExpressMiddlewareFactory<SpyConfig>;
export default spyMiddlewareFactory;
