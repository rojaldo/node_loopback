"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/rest-explorer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const testlab_1 = require("@loopback/testlab");
const express_1 = tslib_1.__importDefault(require("express"));
const __1 = require("../..");
describe('REST Explorer mounted as an express router', () => {
    let client;
    let expressApp;
    let server;
    context('default explorer config', () => {
        beforeEach(givenLoopBackApp);
        beforeEach(givenExpressApp);
        beforeEach(givenClient);
        it('exposes API Explorer at "/api/explorer/"', async () => {
            await client
                .get('/api/explorer/')
                .expect(200)
                .expect('content-type', /html/)
                .expect(/url\: '\.\/openapi\.json'\,/);
        });
        it('redirects from "/api/explorer" to "/api/explorer/"', async () => {
            await client
                .get('/api/explorer')
                .expect(301)
                // expect relative redirect so that it works seamlessly with many forms
                // of base path, whether within the app or applied by a reverse proxy
                .expect('location', './explorer/');
        });
        it('uses correct URLs when basePath is set', async () => {
            server.basePath('/v1');
            await client
                // static assets (including swagger-ui) honor basePath
                .get('/api/v1/explorer/')
                .expect(200)
                .expect('content-type', /html/)
                // OpenAPI endpoints DO NOT honor basePath
                .expect(/url\: '\.\/openapi\.json'\,/);
        });
    });
    context('self hosted api disabled', () => {
        beforeEach(givenLoopbackAppWithoutSelfHostedSpec);
        beforeEach(givenExpressApp);
        beforeEach(givenClient);
        it('exposes API Explorer at "/api/explorer/"', async () => {
            await client
                .get('/api/explorer/')
                .expect(200)
                .expect('content-type', /html/)
                .expect(/url\: '\/api\/openapi\.json'\,/);
        });
        it('uses correct URLs when basePath is set', async () => {
            server.basePath('/v1');
            await client
                // static assets (including swagger-ui) honor basePath
                .get('/api/v1/explorer/')
                .expect(200)
                .expect('content-type', /html/)
                // OpenAPI endpoints DO NOT honor basePath
                .expect(/url\: '\/api\/openapi\.json'\,/);
        });
        async function givenLoopbackAppWithoutSelfHostedSpec() {
            return givenLoopBackApp(undefined, {
                useSelfHostedSpec: false,
            });
        }
    });
    async function givenLoopBackApp(options = { rest: { port: 0 } }, explorerConfig) {
        options.rest = (0, testlab_1.givenHttpServerConfig)(options.rest);
        const app = new rest_1.RestApplication(options);
        if (explorerConfig) {
            app.configure(__1.RestExplorerBindings.COMPONENT).to(explorerConfig);
        }
        app.component(__1.RestExplorerComponent);
        server = await app.getServer(rest_1.RestServer);
    }
    /**
     * Create an express app that mounts the LoopBack routes to `/api`
     */
    function givenExpressApp() {
        expressApp = (0, express_1.default)();
        expressApp.use('/api', (req, res, _next) => {
            // defer calling of `server.requestHandler` until a request arrives
            server.requestHandler(req, res);
        });
    }
    function givenClient() {
        client = (0, testlab_1.createClientForHandler)(expressApp);
    }
});
//# sourceMappingURL=rest-explorer.express.acceptance.js.map