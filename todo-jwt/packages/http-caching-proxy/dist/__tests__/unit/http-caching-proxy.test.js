"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/http-caching-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const http_caching_proxy_1 = require("../../http-caching-proxy");
describe('HttpCachingProxy', () => {
    describe('constructor', () => {
        it('rejects missing cachePath option', () => {
            (0, testlab_1.expect)(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            () => new http_caching_proxy_1.HttpCachingProxy({ cachedPath: undefined })).throwError(/required option.*cachePath/i);
        });
    });
});
//# sourceMappingURL=http-caching-proxy.test.js.map