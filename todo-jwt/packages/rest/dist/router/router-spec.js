"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRouterSpec = void 0;
function assignRouterSpec(target, additions) {
    if (additions.components) {
        if (!target.components)
            target.components = {};
        for (const key in additions.components) {
            if (!target.components[key])
                target.components[key] = {};
            Object.assign(target.components[key], additions.components[key]);
        }
    }
    for (const url in additions.paths) {
        if (!(url in target.paths))
            target.paths[url] = {};
        for (const verbOrKey in additions.paths[url]) {
            // routes registered earlier takes precedence
            if (verbOrKey in target.paths[url])
                continue;
            target.paths[url][verbOrKey] = additions.paths[url][verbOrKey];
        }
    }
    if (additions.tags && additions.tags.length > 0) {
        if (!target.tags)
            target.tags = [];
        for (const tag of additions.tags) {
            // tags defined earlier take precedence
            if (target.tags.some(t => t.name === tag.name))
                continue;
            target.tags.push(tag);
        }
    }
}
exports.assignRouterSpec = assignRouterSpec;
//# sourceMappingURL=router-spec.js.map