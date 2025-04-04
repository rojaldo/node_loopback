"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/http-caching-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const axios_1 = tslib_1.__importDefault(require("axios"));
const delay_1 = tslib_1.__importDefault(require("delay"));
const node_events_1 = require("node:events");
const node_http_1 = tslib_1.__importDefault(require("node:http"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const rimraf_1 = require("rimraf");
const tunnel_1 = tslib_1.__importDefault(require("tunnel"));
const node_url_1 = require("node:url");
const http_caching_proxy_1 = require("../../http-caching-proxy");
const CACHE_DIR = node_path_1.default.join(__dirname, '.cache');
describe('HttpCachingProxy', () => {
    let stubServerUrl;
    before(givenStubServer);
    after(stopStubServer);
    let proxy;
    after(stopProxy);
    beforeEach('clean cache dir', async () => (0, rimraf_1.rimraf)(CACHE_DIR));
    it('provides "url" property when running', async () => {
        await givenRunningProxy();
        (0, testlab_1.expect)(proxy.url).to.match(/^http:\/\/127.0.0.1:\d+$/);
    });
    it('provides invalid "url" property when not running', async () => {
        proxy = new http_caching_proxy_1.HttpCachingProxy({ cachePath: CACHE_DIR });
        (0, testlab_1.expect)(proxy.url).to.match(/not-running/);
    });
    it('proxies HTTP requests', async function () {
        // Increase the timeout to accommodate slow network connections
        this.timeout(30000);
        await givenRunningProxy();
        const result = await makeRequest({
            url: 'http://example.com',
        });
        (0, testlab_1.expect)(result.statusCode).to.equal(200);
        (0, testlab_1.expect)(result.body).to.containEql('example');
    });
    it('reports error for HTTP requests', async function () {
        // Increase the timeout to accommodate slow network connections
        this.timeout(30000);
        await givenRunningProxy({ logError: false });
        await (0, testlab_1.expect)(makeRequest({
            url: 'http://does-not-exist.example.com',
        })).to.be.rejectedWith(
        // The error can be
        // '502 - "Error: getaddrinfo EAI_AGAIN does-not-exist.example.com:80"'
        // '502 - "Error: getaddrinfo ENOTFOUND does-not-exist.example.com'
        /502 - "Error: getaddrinfo/);
    });
    it('reports timeout error for HTTP requests', async function () {
        await givenRunningProxy({ logError: false, timeout: 1 });
        await (0, testlab_1.expect)(makeRequest({
            url: 'http://www.mocky.io/v2/5dade5e72d0000a542e4bd9c?mocky-delay=1000ms',
        })).to.be.rejectedWith(/502 - "AxiosError: timeout of 1ms exceeded/);
    });
    it('proxies HTTPs requests (no tunneling)', async function () {
        // Increase the timeout to accommodate slow network connections
        this.timeout(30000);
        await givenRunningProxy();
        const result = await makeRequest({
            url: 'https://example.com',
        });
        (0, testlab_1.expect)(result.statusCode).to.equal(200);
        (0, testlab_1.expect)(result.body).to.containEql('example');
    });
    it('rejects CONNECT requests (HTTPS tunneling)', async () => {
        await givenRunningProxy();
        const agent = tunnel_1.default.httpsOverHttp({
            proxy: getTunnelProxyConfig(proxy.url),
        });
        const resultPromise = makeRequest({
            url: 'https://example.com',
            httpsAgent: agent,
            proxy: false,
        });
        await (0, testlab_1.expect)(resultPromise).to.be.rejectedWith(/tunneling socket could not be established, statusCode=501/);
    });
    it('forwards request/response headers', async () => {
        await givenRunningProxy();
        givenServerDumpsRequests();
        const result = await makeRequest({
            url: stubServerUrl,
            responseType: 'json',
            headers: { 'x-client': 'test' },
        });
        (0, testlab_1.expect)(result.headers).to.containEql({
            'x-server': 'dumping-server',
        });
        (0, testlab_1.expect)(result.body.headers).to.containDeep({
            'x-client': 'test',
        });
    });
    it('forwards request body', async () => {
        await givenRunningProxy();
        stubServerHandler = (req, res) => req.pipe(res);
        const result = await makeRequest({
            method: 'POST',
            url: stubServerUrl,
            data: 'a text body',
        });
        (0, testlab_1.expect)(result.body).to.equal('a text body');
    });
    it('caches responses', async () => {
        await givenRunningProxy();
        let counter = 1;
        stubServerHandler = function (req, res) {
            res.writeHead(201, { 'x-counter': counter++ });
            res.end(JSON.stringify({ counter: counter++ }));
        };
        const opts = {
            url: stubServerUrl,
            responseType: 'json',
        };
        const result1 = await makeRequest(opts);
        const result2 = await makeRequest(opts);
        (0, testlab_1.expect)(result1.statusCode).equal(201);
        (0, testlab_1.expect)(result1.statusCode).equal(result2.statusCode);
        (0, testlab_1.expect)(result1.body).deepEqual(result2.body);
        (0, testlab_1.expect)(result1.headers).deepEqual(result2.headers);
    });
    it('refreshes expired cache entries', async () => {
        await givenRunningProxy({ ttl: 1 });
        let counter = 1;
        stubServerHandler = (req, res) => res.end(String(counter++));
        const opts = {
            url: stubServerUrl,
        };
        const result1 = await makeRequest(opts);
        await (0, delay_1.default)(10);
        const result2 = await makeRequest(opts);
        (0, testlab_1.expect)(result1.body).to.equal(1);
        (0, testlab_1.expect)(result2.body).to.equal(2);
    });
    it('handles the case where backend service is not running', async function () {
        // This test takes a bit longer to finish on windows.
        this.timeout(3000);
        await givenRunningProxy({ logError: false });
        await (0, testlab_1.expect)(makeRequest({ url: 'http://127.0.0.1:1/' })).to.be.rejectedWith({
            status: 502,
        });
    });
    function givenRunningProxy(options) {
        proxy = new http_caching_proxy_1.HttpCachingProxy(Object.assign({ cachePath: CACHE_DIR }, options));
        return proxy.start();
    }
    async function stopProxy() {
        if (!proxy)
            return;
        await proxy.stop();
    }
    /**
     * Parse an url to `tunnel` proxy options
     * @param url - proxy url string
     */
    function getTunnelProxyConfig(url) {
        const parsed = new node_url_1.URL(url);
        const options = {
            host: parsed.hostname,
            port: parseInt(parsed.port),
        };
        if (parsed.username) {
            options.proxyAuth = `${parsed.username}:${parsed.password}`;
        }
        return options;
    }
    /**
     * Parse an url to Axios proxy configuration object
     * @param url - proxy url string
     */
    function getProxyConfig(url) {
        const parsed = new node_url_1.URL(url);
        return {
            protocol: parsed.protocol,
            host: parsed.hostname,
            port: parseInt(parsed.port),
            ...(parsed.username && {
                auth: {
                    username: parsed.username,
                    password: parsed.password,
                },
            }),
        };
    }
    const axiosInstance = axios_1.default.create({
        // Provide a custom function to control when Axios throws errors based on
        // http status code. Please note that Axios creates a new error in such
        // condition and the original low-level error is lost
        validateStatus: () => true,
    });
    /**
     * Helper method to make a http request via the proxy
     * @param config - Axios request
     */
    async function makeRequest(config) {
        config = {
            proxy: getProxyConfig(proxy.url),
            ...config,
        };
        const res = await axiosInstance(config);
        // Throw an error with message from the original error
        if (res.status >= 300) {
            const errData = JSON.stringify(res.data);
            const err = new Error(`${res.status} - ${errData}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            err.status = res.status;
            throw err;
        }
        const patchedRes = Object.create(res);
        patchedRes.statusCode = res.status;
        patchedRes.body = res.data;
        return patchedRes;
    }
    let stubServer, stubServerHandler;
    async function givenStubServer() {
        stubServerHandler = undefined;
        stubServer = node_http_1.default.createServer(function handleRequest(req, res) {
            if (stubServerHandler) {
                try {
                    stubServerHandler(req, res);
                }
                catch (err) {
                    res.end(500);
                    process.nextTick(() => {
                        throw err;
                    });
                }
            }
            else {
                res.writeHead(501);
                res.end();
            }
        });
        stubServer.listen(0);
        await (0, node_events_1.once)(stubServer, 'listening');
        const address = stubServer.address();
        stubServerUrl = `http://127.0.0.1:${address.port}`;
    }
    async function stopStubServer() {
        if (!stubServer)
            return;
        stubServer.close();
        await (0, node_events_1.once)(stubServer, 'close');
        stubServer = undefined;
    }
    function givenServerDumpsRequests() {
        stubServerHandler = function dumpRequest(req, res) {
            res.writeHead(200, {
                'x-server': 'dumping-server',
            });
            res.write(JSON.stringify({
                method: req.method,
                url: req.url,
                headers: req.headers,
            }));
            res.end();
        };
    }
});
//# sourceMappingURL=http-caching-proxy.integration.js.map