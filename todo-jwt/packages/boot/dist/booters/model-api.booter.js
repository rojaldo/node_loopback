"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestDefaults = exports.ModelApiBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const model_api_builder_1 = require("@loopback/model-api-builder");
const debug_1 = tslib_1.__importDefault(require("debug"));
const path = tslib_1.__importStar(require("path"));
const keys_1 = require("../keys");
const types_1 = require("../types");
const base_artifact_booter_1 = require("./base-artifact.booter");
const debug = (0, debug_1.default)('loopback:boot:model-api');
let ModelApiBooter = class ModelApiBooter extends base_artifact_booter_1.BaseArtifactBooter {
    constructor(app, projectRoot, getModelApiBuilders, booterConfig = {}) {
        // TODO assert that `app` has RepositoryMixin members
        super(projectRoot, 
        // Set booter options if passed in via bootConfig
        Object.assign({}, exports.RestDefaults, booterConfig));
        this.app = app;
        this.getModelApiBuilders = getModelApiBuilders;
        this.booterConfig = booterConfig;
    }
    /**
     * Load the the model config files
     */
    async load() {
        // Important: don't call `super.load()` here, it would try to load
        // classes via `loadClassesFromFiles` - that won't work for JSON files
        await Promise.all(this.discovered.map(async (f) => {
            try {
                // It's important to await before returning,
                // otherwise the catch block won't receive errors
                await this.setupModel(f);
            }
            catch (err) {
                const shortPath = path.relative(this.projectRoot, f);
                err.message += ` (while loading ${shortPath})`;
                throw err;
            }
        }));
    }
    /**
     * Set up the loaded model classes
     */
    async setupModel(configFile) {
        const cfg = require(configFile);
        debug('Loaded model config from %s', path.relative(this.projectRoot, configFile), cfg);
        const modelClass = cfg.model;
        if (typeof modelClass !== 'function') {
            throw new Error(`Invalid "model" field. Expected a Model class, found ${modelClass}`);
        }
        const builder = await this.getApiBuilderForPattern(cfg.pattern);
        await builder.build(this.app, modelClass, cfg);
    }
    /**
     * Retrieve the API builder that matches the pattern provided
     * @param pattern - name of pattern for an API builder
     */
    async getApiBuilderForPattern(pattern) {
        const allBuilders = await this.getModelApiBuilders();
        const builder = allBuilders.find(b => b.pattern === pattern);
        if (!builder) {
            const availableBuilders = allBuilders.map(b => b.pattern).join(', ');
            throw new Error(`Unsupported API pattern "${pattern}". ` +
                `Available patterns: ${availableBuilders || '<none>'}`);
        }
        return builder;
    }
};
exports.ModelApiBooter = ModelApiBooter;
exports.ModelApiBooter = ModelApiBooter = tslib_1.__decorate([
    (0, types_1.booter)('modelApi'),
    (0, core_1.extensionPoint)(model_api_builder_1.MODEL_API_BUILDER_PLUGINS),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, (0, core_1.extensions)()),
    tslib_1.__param(3, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [Object, String, Function, Object])
], ModelApiBooter);
/**
 * Default ArtifactOptions for ControllerBooter.
 */
exports.RestDefaults = {
    dirs: ['model-endpoints'],
    extensions: ['-config.js'],
    nested: true,
};
//# sourceMappingURL=model-api.booter.js.map