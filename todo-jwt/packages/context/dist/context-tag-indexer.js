"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextTagIndexer = void 0;
const binding_filter_1 = require("./binding-filter");
/**
 * Indexer for context bindings by tag
 */
class ContextTagIndexer {
    constructor(context) {
        this.context = context;
        /**
         * Index for bindings by tag names
         */
        this.bindingsIndexedByTag = new Map();
        this.setupTagIndexForBindings();
    }
    /**
     * Set up context/binding listeners and refresh index for bindings by tag
     */
    setupTagIndexForBindings() {
        this.bindingEventListener = ({ binding, operation }) => {
            if (operation === 'tag') {
                this.updateTagIndexForBinding(binding);
            }
        };
        this.tagIndexListener = event => {
            const { binding, type } = event;
            if (event.context !== this.context)
                return;
            if (type === 'bind') {
                this.updateTagIndexForBinding(binding);
                binding.on('changed', this.bindingEventListener);
            }
            else if (type === 'unbind') {
                this.removeTagIndexForBinding(binding);
                binding.removeListener('changed', this.bindingEventListener);
            }
        };
        this.context.on('bind', this.tagIndexListener);
        this.context.on('unbind', this.tagIndexListener);
    }
    /**
     * Remove tag index for the given binding
     * @param binding - Binding object
     */
    removeTagIndexForBinding(binding) {
        for (const [, bindings] of this.bindingsIndexedByTag) {
            bindings.delete(binding);
        }
    }
    /**
     * Update tag index for the given binding
     * @param binding - Binding object
     */
    updateTagIndexForBinding(binding) {
        this.removeTagIndexForBinding(binding);
        for (const tag of binding.tagNames) {
            let bindings = this.bindingsIndexedByTag.get(tag);
            if (bindings == null) {
                bindings = new Set();
                this.bindingsIndexedByTag.set(tag, bindings);
            }
            bindings.add(binding);
        }
    }
    /**
     * Find bindings by tag leveraging indexes
     * @param tag - Tag name pattern or name/value pairs
     */
    findByTagIndex(tag) {
        let tagNames;
        // A flag to control if a union of matched bindings should be created
        let union = false;
        if (tag instanceof RegExp) {
            // For wildcard/regexp, a union of matched bindings is desired
            union = true;
            // Find all matching tag names
            tagNames = [];
            for (const t of this.bindingsIndexedByTag.keys()) {
                if (tag.test(t)) {
                    tagNames.push(t);
                }
            }
        }
        else if (typeof tag === 'string') {
            tagNames = [tag];
        }
        else {
            tagNames = Object.keys(tag);
        }
        let filter;
        let bindings;
        for (const t of tagNames) {
            const bindingsByTag = this.bindingsIndexedByTag.get(t);
            if (bindingsByTag == null)
                break; // One of the tags is not found
            filter = filter !== null && filter !== void 0 ? filter : (0, binding_filter_1.filterByTag)(tag);
            const matched = new Set(Array.from(bindingsByTag).filter(filter));
            if (!union && matched.size === 0)
                break; // One of the tag name/value is not found
            if (bindings == null) {
                // First set of bindings matching the tag
                bindings = matched;
            }
            else {
                if (union) {
                    matched.forEach(b => bindings === null || bindings === void 0 ? void 0 : bindings.add(b));
                }
                else {
                    // Now need to find intersected bindings against visited tags
                    const intersection = new Set();
                    bindings.forEach(b => {
                        if (matched.has(b)) {
                            intersection.add(b);
                        }
                    });
                    bindings = intersection;
                }
                if (!union && bindings.size === 0)
                    break;
            }
        }
        return bindings == null ? [] : Array.from(bindings);
    }
    close() {
        this.context.removeListener('bind', this.tagIndexListener);
        this.context.removeListener('unbind', this.tagIndexListener);
    }
}
exports.ContextTagIndexer = ContextTagIndexer;
//# sourceMappingURL=context-tag-indexer.js.map