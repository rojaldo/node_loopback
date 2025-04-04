"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/http-caching-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCachingProxy = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const node_events_1 = require("node:events");
const node_http_1 = require("node:http");
const cacache = require('cacache');
const debug = (0, debug_1.default)('loopback:http-caching-proxy');
const DEFAULT_OPTIONS = {
    port: 0,
    ttl: 24 * 60 * 60 * 1000,
    logError: true,
    timeout: 0,
};
/**
 * The HTTP proxy implementation.
 */
class HttpCachingProxy {
    constructor(options) {
        this._options = Object.assign({}, DEFAULT_OPTIONS, options);
        if (!this._options.cachePath) {
            throw new Error('Required option missing: "cachePath"');
        }
        this.url = 'http://proxy-not-running';
        this._server = undefined;
        this._axios = axios_1.default.create({
            // Provide a custom function to control when Axios throws errors based on
            // http status code. Please note that Axios creates a new error in such
            // condition and the original low-level error is lost
            validateStatus: () => true,
        });
    }
    /**
     * Start listening.
     */
    async start() {
        this._server = (0, node_http_1.createServer)((request, response) => {
            this._handle(request, response);
        });
        this._server.on('connect', (req, socket) => {
            // Reject tunneling requests
            socket.write('HTTP/1.1 501 Not Implemented\r\n\r\n');
            socket.destroy();
        });
        this._server.listen(this._options.port);
        await (0, node_events_1.once)(this._server, 'listening');
        const address = this._server.address();
        this.url = `http://127.0.0.1:${address.port}`;
    }
    /**
     * Stop listening.
     */
    async stop() {
        if (!this._server)
            return;
        this.url = 'http://proxy-not-running';
        const server = this._server;
        this._server = undefined;
        server.close();
        await (0, node_events_1.once)(server, 'close');
    }
    _handle(request, response) {
        const onerror = (error) => {
            this.logError(request, error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.statusCode = error.statusCode || 502;
            response.end(`${error.name}: ${error.message}`);
        };
        try {
            this._handleAsync(request, response).catch(onerror);
        }
        catch (err) {
            onerror(err);
        }
    }
    async _handleAsync(request, response) {
        debug('Incoming request %s %s', request.method, request.url, request.headers);
        const cacheKey = this._getCacheKey(request);
        try {
            const entry = await cacache.get(this._options.cachePath, cacheKey);
            if (entry.metadata.createdAt + this._options.ttl > Date.now()) {
                debug('Sending cached response for %s', cacheKey);
                this._sendCachedEntry(entry.data, entry.metadata, response);
                return;
            }
            debug('Cache entry expired for %s', cacheKey);
            // (continue to forward the request)
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                console.warn('Cannot load cached entry.', error);
            }
            debug('Cache miss for %s', cacheKey);
            // (continue to forward the request)
        }
        await this._forwardRequest(request, response);
    }
    _getCacheKey(request) {
        // TODO(bajtos) consider adding selected/all headers to the key
        return `${request.method} ${request.url}`;
    }
    _sendCachedEntry(data, metadata, response) {
        response.writeHead(metadata.statusCode, metadata.headers);
        response.end(data);
    }
    async _forwardRequest(clientRequest, clientResponse) {
        debug('Forward request to %s %s', clientRequest.method, clientRequest.url);
        const backendResponse = await this._axios({
            method: clientRequest.method,
            url: clientRequest.url,
            headers: clientRequest.headers,
            data: clientRequest,
            // Set the response type to `arraybuffer` to force the `data` to be a
            // Buffer to allow ease of caching
            // Since this proxy is for testing only, buffering the entire
            // response body is acceptable.
            responseType: 'arraybuffer',
            timeout: this._options.timeout || undefined,
        });
        // If not removed, returns an "Expected http/" error.
        delete backendResponse.headers['content-length'];
        debug('Got response for %s %s -> %s', clientRequest.method, clientRequest.url, backendResponse.status, backendResponse.headers, backendResponse.data);
        const metadata = {
            statusCode: backendResponse.status,
            headers: backendResponse.headers,
            createdAt: Date.now(),
        };
        // Ideally, we should pipe the backend response to both
        // client response and cachache.put.stream.
        //   r.pipe(clientResponse);
        //   r.pipe(cacache.put.stream(...))
        // To do so, we would have to defer .end() call on the client
        // response until the content is stored in the cache,
        // which is rather complex and involved.
        // Without that synchronization, the client can start sending
        // follow-up requests that won't be served from the cache as
        // the cache has not been updated yet.
        const data = backendResponse.data;
        await cacache.put(this._options.cachePath, this._getCacheKey(clientRequest), data, { metadata });
        clientResponse.writeHead(backendResponse.status, backendResponse.headers);
        clientResponse.end(data);
    }
    logError(request, error) {
        var _a, _b;
        if (this._options.logError) {
            console.error('Cannot proxy %s %s.', request.method, request.url, (_a = error.stack) !== null && _a !== void 0 ? _a : error);
        }
        else {
            debug('Cannot proxy %s %s.', request.method, request.url, (_b = error.stack) !== null && _b !== void 0 ? _b : error);
        }
    }
}
exports.HttpCachingProxy = HttpCachingProxy;
//# sourceMappingURL=http-caching-proxy.js.map