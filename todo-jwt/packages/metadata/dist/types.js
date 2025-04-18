"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/metadata
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataAccessor = void 0;
/**
 * A strongly-typed metadata accessor via reflection
 * @typeParam T - Type of the metadata value
 * @typeParam D - Type of the decorator
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MetadataAccessor {
    constructor(key) {
        this.key = key;
    }
    toString() {
        return this.key;
    }
    /**
     * Create a strongly-typed metadata accessor
     * @param key - The metadata key
     * @typeParam V - Type of the metadata value
     * @typeParam DT - Type of the decorator
     */
    static create(key) {
        return new MetadataAccessor(key);
    }
}
exports.MetadataAccessor = MetadataAccessor;
//# sourceMappingURL=types.js.map