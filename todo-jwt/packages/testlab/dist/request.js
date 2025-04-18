"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsGetAsync = exports.httpGetAsync = void 0;
const tslib_1 = require("tslib");
const http_1 = tslib_1.__importDefault(require("http"));
const https_1 = tslib_1.__importDefault(require("https"));
const url_1 = tslib_1.__importDefault(require("url"));
/**
 * Async wrapper for making HTTP GET requests
 * @param urlString
 */
function httpGetAsync(urlString, agent) {
    return new Promise((resolve, reject) => {
        const urlOptions = url_1.default.parse(urlString);
        const options = { agent, ...urlOptions };
        http_1.default.get(options, resolve).on('error', reject);
    });
}
exports.httpGetAsync = httpGetAsync;
/**
 * Async wrapper for making HTTPS GET requests
 * @param urlString
 */
function httpsGetAsync(urlString, agent) {
    agent =
        agent !== null && agent !== void 0 ? agent : new https_1.default.Agent({
            rejectUnauthorized: false,
        });
    const urlOptions = url_1.default.parse(urlString);
    const options = { agent, ...urlOptions };
    return new Promise((resolve, reject) => {
        https_1.default.get(options, resolve).on('error', reject);
    });
}
exports.httpsGetAsync = httpsGetAsync;
//# sourceMappingURL=request.js.map