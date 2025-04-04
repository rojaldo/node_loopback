"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/metadata
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reflector = exports.NamespacedReflect = void 0;
require("reflect-metadata");
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * namespaced wrapper to handle reflect api
 */
class NamespacedReflect {
    /**
     * @param namespace - Namespace to bind this reflect context
     */
    constructor(namespace) {
        this.namespace = namespace;
    }
    getMetadataKey(metadataKey) {
        // prefix namespace, if provided, to the metadata key
        return this.namespace ? this.namespace + ':' + metadataKey : metadataKey;
    }
    /**
     * define metadata for a target class or it's property/method
     */
    defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        metadataKey = this.getMetadataKey(metadataKey);
        if (propertyKey) {
            Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        else {
            Reflect.defineMetadata(metadataKey, metadataValue, target);
        }
    }
    /**
     * lookup metadata from a target object and its prototype chain
     */
    getMetadata(metadataKey, target, propertyKey) {
        metadataKey = this.getMetadataKey(metadataKey);
        if (propertyKey) {
            return Reflect.getMetadata(metadataKey, target, propertyKey);
        }
        return Reflect.getMetadata(metadataKey, target);
    }
    /**
     * get own metadata for a target object or it's property/method
     */
    getOwnMetadata(metadataKey, target, propertyKey) {
        metadataKey = this.getMetadataKey(metadataKey);
        if (propertyKey) {
            return Reflect.getOwnMetadata(metadataKey, target, propertyKey);
        }
        return Reflect.getOwnMetadata(metadataKey, target);
    }
    /**
     * Check if the target has corresponding metadata
     * @param metadataKey - Key
     * @param target - Target
     * @param propertyKey - Optional property key
     */
    hasMetadata(metadataKey, target, propertyKey) {
        metadataKey = this.getMetadataKey(metadataKey);
        if (propertyKey) {
            return Reflect.hasMetadata(metadataKey, target, propertyKey);
        }
        return Reflect.hasMetadata(metadataKey, target);
    }
    hasOwnMetadata(metadataKey, target, propertyKey) {
        metadataKey = this.getMetadataKey(metadataKey);
        if (propertyKey) {
            return Reflect.hasOwnMetadata(metadataKey, target, propertyKey);
        }
        return Reflect.hasOwnMetadata(metadataKey, target);
    }
    deleteMetadata(metadataKey, target, propertyKey) {
        metadataKey = this.getMetadataKey(metadataKey);
        if (propertyKey) {
            return Reflect.deleteMetadata(metadataKey, target, propertyKey);
        }
        return Reflect.deleteMetadata(metadataKey, target);
    }
    getMetadataKeys(target, propertyKey) {
        let keys;
        if (propertyKey) {
            keys = Reflect.getMetadataKeys(target, propertyKey);
        }
        else {
            keys = Reflect.getMetadataKeys(target);
        }
        const metaKeys = [];
        if (keys) {
            if (!this.namespace)
                return keys; // No normalization is needed
            const prefix = this.namespace + ':';
            for (const key of keys) {
                if (key.indexOf(prefix) === 0) {
                    // Only add keys with the namespace prefix
                    metaKeys.push(key.slice(prefix.length));
                }
            }
        }
        return metaKeys;
    }
    getOwnMetadataKeys(target, propertyKey) {
        let keys;
        if (propertyKey) {
            keys = Reflect.getOwnMetadataKeys(target, propertyKey);
        }
        else {
            keys = Reflect.getOwnMetadataKeys(target);
        }
        const metaKeys = [];
        if (keys) {
            if (!this.namespace)
                return keys; // No normalization is needed
            const prefix = this.namespace + ':';
            for (const key of keys) {
                if (key.indexOf(prefix) === 0) {
                    // Only add keys with the namespace prefix
                    metaKeys.push(key.slice(prefix.length));
                }
            }
        }
        return metaKeys;
    }
    decorate(decorators, target, targetKey, descriptor) {
        if (targetKey) {
            return Reflect.decorate(decorators, target, targetKey, descriptor);
        }
        else {
            return Reflect.decorate(decorators, target);
        }
    }
    metadata(metadataKey, metadataValue) {
        metadataKey = this.getMetadataKey(metadataKey);
        return Reflect.metadata(metadataKey, metadataValue);
    }
}
exports.NamespacedReflect = NamespacedReflect;
exports.Reflector = new NamespacedReflect('loopback');
//# sourceMappingURL=reflect.js.map