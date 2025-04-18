"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.booter = exports.BOOTER_PHASES = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
/**
 * Export of an array of all the Booter phases supported by the interface
 * above, in the order they should be run.
 */
exports.BOOTER_PHASES = ['configure', 'discover', 'load'];
/**
 * `@booter` decorator to mark a class as a `Booter` and specify the artifact
 * namespace for the configuration of the booter
 *
 * @example
 * ```ts
 * @booter('controllers')
 * export class ControllerBooter extends BaseArtifactBooter {
 *   constructor(
 *     @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
 *     @inject(BootBindings.PROJECT_ROOT) projectRoot: string,
 *     @config()
 *    public controllerConfig: ArtifactOptions = {},
 *   ) {
 *   // ...
 *   }
 * }
 * ```
 *
 * @param artifactNamespace - Namespace for the artifact. It will be used to
 * inject configuration from boot options. For example, the Booter class
 * decorated with `@booter('controllers')` can receive its configuration via
 * `@config()` from the `controllers` property of boot options.
 *
 * @param specs - Extra specs for the binding
 */
function booter(artifactNamespace, ...specs) {
    return (0, core_1.injectable)({
        tags: {
            artifactNamespace,
            [keys_1.BootTags.BOOTER]: keys_1.BootTags.BOOTER,
            [core_1.ContextTags.NAMESPACE]: keys_1.BootBindings.BOOTERS,
        },
    }, ...specs);
}
exports.booter = booter;
//# sourceMappingURL=types.js.map