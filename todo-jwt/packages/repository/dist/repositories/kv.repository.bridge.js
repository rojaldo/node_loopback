"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultKeyValueRepository = void 0;
const legacy_juggler_bridge_1 = require("./legacy-juggler-bridge");
/**
 * An implementation of KeyValueRepository based on loopback-datasource-juggler
 */
class DefaultKeyValueRepository {
    /**
     * Construct a KeyValueRepository with a legacy DataSource
     * @param ds - Legacy DataSource
     */
    constructor(entityClass, ds) {
        this.entityClass = entityClass;
        // KVModel class is placeholder to receive methods from KeyValueAccessObject
        // through mixin
        this.kvModelClass =
            ds.createModel('_kvModel');
    }
    delete(key, options) {
        return (0, legacy_juggler_bridge_1.ensurePromise)(this.kvModelClass.delete(key, options));
    }
    deleteAll(options) {
        return (0, legacy_juggler_bridge_1.ensurePromise)(this.kvModelClass.deleteAll(options));
    }
    toEntity(modelData) {
        if (modelData == null)
            return modelData;
        let data = modelData;
        if (typeof modelData.toObject === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data = modelData.toObject();
        }
        return new this.entityClass(data);
    }
    async get(key, options) {
        const val = this.kvModelClass.get(key, options);
        const result = await (0, legacy_juggler_bridge_1.ensurePromise)(val);
        return this.toEntity(result);
    }
    set(key, value, options) {
        return (0, legacy_juggler_bridge_1.ensurePromise)(this.kvModelClass.set(key, value, options));
    }
    expire(key, ttl, options) {
        return (0, legacy_juggler_bridge_1.ensurePromise)(this.kvModelClass.expire(key, ttl, options));
    }
    ttl(key, options) {
        return (0, legacy_juggler_bridge_1.ensurePromise)(this.kvModelClass.ttl(key, options));
    }
    keys(filter, options) {
        const kvModelClass = this.kvModelClass;
        const iterator = {
            [Symbol.asyncIterator]() {
                return new AsyncKeyIteratorImpl(kvModelClass.iterateKeys(filter, options));
            },
        };
        return iterator;
    }
}
exports.DefaultKeyValueRepository = DefaultKeyValueRepository;
class AsyncKeyIteratorImpl {
    constructor(keys) {
        this.keys = keys;
    }
    next() {
        const key = (0, legacy_juggler_bridge_1.ensurePromise)(this.keys.next());
        return key.then(k => {
            return { done: k === undefined, value: k !== null && k !== void 0 ? k : '' };
        });
    }
}
//# sourceMappingURL=kv.repository.bridge.js.map