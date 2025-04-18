"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/service-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.getService = exports.juggler = void 0;
const tslib_1 = require("tslib");
const loopback_datasource_juggler_1 = tslib_1.__importDefault(require("loopback-datasource-juggler"));
var juggler;
(function (juggler) {
    juggler.DataSource = loopback_datasource_juggler_1.default.DataSource;
})(juggler || (exports.juggler = juggler = {}));
/**
 * Get a service proxy from a LoopBack 3.x data source backed by
 * service-oriented connectors such as `rest`, `soap`, and `grpc`.
 *
 * @param ds - A legacy data source
 * @typeParam T - The generic type of service interface
 */
async function getService(ds) {
    await ds.connect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ds.DataAccessObject;
}
exports.getService = getService;
//# sourceMappingURL=legacy-juggler-bridge.js.map