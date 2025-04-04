/// <reference types="node" />
/// <reference types="node" />
import { ServerOptions as HttpsServerOptions } from 'https';
import { ListenOptions } from 'net';
export interface HttpOptions extends ListenOptions {
    protocol?: 'http';
}
export interface HttpsOptions extends ListenOptions, HttpsServerOptions {
    protocol: 'https';
}
/**
 * An object that requires host and port properties
 */
export interface HostPort {
    host: string;
    port: number;
}
/**
 * Create an HTTP-server configuration that works well in test environments.
 *  - Ask the operating system to assign a free (ephemeral) port.
 *  - Use IPv4 localhost `127.0.0.1` to avoid known IPv6 issues in Docker-based
 *    environments like Travis-CI.
 *  - Provide default TLS key & cert when `protocol` is set to `https`.
 *
 * @param customConfig - Additional configuration options to apply.
 */
export declare function givenHttpServerConfig<T extends HttpOptions | HttpsOptions>(customConfig?: T): HostPort & T;
