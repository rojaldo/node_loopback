/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import http, { IncomingMessage, Server, ServerResponse } from 'http';
import https from 'https';
import { AddressInfo, ListenOptions } from 'net';
/**
 * Request listener function for http/https requests
 */
export type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;
/**
 * The following are for configuring properties which are directly set on
 * https://nodejs.org/api/http.html#http_class_http_server and
 * https://nodejs.org/api/net.html#net_class_net_server
 */
export type HttpServerProperties = Pick<Server, 'keepAliveTimeout' | 'headersTimeout' | 'maxConnections' | 'maxHeadersCount' | 'timeout'>;
/**
 * Base options that are common to http and https servers
 */
export interface BaseHttpOptions extends ListenOptions, Partial<HttpServerProperties> {
    /**
     * The `gracePeriodForClose` property controls how to stop the server
     * gracefully. Its value is the number of milliseconds to wait before
     * in-flight requests finish when the server is being stopped. With this
     * setting, we also reject new requests from existing keep-alive connections
     * in addition to stopping accepting new connections.
     *
     * Defaults to Infinity (don't force-close). If you want to immediately
     * destroy all sockets set its value to `0`.
     *
     * See {@link https://www.npmjs.com/package/stoppable | stoppable}
     */
    gracePeriodForClose?: number;
}
/**
 * HTTP server options
 */
export interface HttpOptions extends BaseHttpOptions {
    protocol?: 'http';
}
/**
 * HTTPS server options
 */
export interface HttpsOptions extends BaseHttpOptions, https.ServerOptions {
    protocol: 'https';
}
/**
 * Possible server options
 *
 */
export type HttpServerOptions = HttpOptions | HttpsOptions;
/**
 * Supported protocols
 *
 */
export type HttpProtocol = 'http' | 'https';
/**
 * HTTP / HTTPS server used by LoopBack's RestServer
 */
export declare class HttpServer {
    private _listening;
    private _protocol;
    private _address;
    private requestListener;
    readonly server: http.Server | https.Server;
    private _stoppable;
    readonly serverOptions: HttpServerOptions;
    /**
     * @param requestListener
     * @param serverOptions
     */
    constructor(requestListener: RequestListener, serverOptions?: HttpServerOptions);
    /**
     * Starts the HTTP / HTTPS server
     */
    start(): Promise<void>;
    /**
     * Stops the HTTP / HTTPS server
     */
    stop(): Promise<void>;
    /**
     * Protocol of the HTTP / HTTPS server
     */
    get protocol(): HttpProtocol;
    /**
     * Port number of the HTTP / HTTPS server
     */
    get port(): number;
    /**
     * Host of the HTTP / HTTPS server
     */
    get host(): string | undefined;
    /**
     * URL of the HTTP / HTTPS server
     */
    get url(): string;
    /**
     * State of the HTTP / HTTPS server
     */
    get listening(): boolean;
    /**
     * Address of the HTTP / HTTPS server
     */
    get address(): string | AddressInfo | undefined;
}
