"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/metadata
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodMultiDecoratorFactory = exports.MethodParameterDecoratorFactory = exports.ParameterDecoratorFactory = exports.MethodDecoratorFactory = exports.PropertyDecoratorFactory = exports.ClassDecoratorFactory = exports.DecoratorFactory = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const reflect_1 = require("./reflect");
const debug = (0, debug_1.default)('loopback:metadata:decorator');
/**
 * Base factory class for decorator functions
 *
 * @example
 * ```
 * function classDecorator(spec: MySpec): ClassDecorator {
 *   return ClassDecoratorFactory.createDecorator('my-key', spec);
 * }
 * ```
 * or
 * ```
 * function classDecorator(spec: MySpec): ClassDecorator {
 *   const factory: ClassDecoratorFactory<MySpec>('my-key', spec);
 *   return factory.create();
 * }
 * ```
 * These functions above declare `@classDecorator` that can be used as follows:
 * ```
 * @classDecorator({x: 1})
 * class MyController {}
 * ```
 */
class DecoratorFactory {
    /**
     * Construct a new class decorator factory
     * @param key - Metadata key
     * @param spec - Metadata object from the decorator function
     * @param options - Options for the decorator. Default to
     * `{allowInheritance: true}` if not provided
     */
    constructor(key, spec, options = {}) {
        var _a;
        this.key = key;
        this.spec = spec;
        this.options = options;
        this.options = Object.assign({
            allowInheritance: true,
            cloneInputSpec: true,
        }, options);
        const defaultDecoratorName = this.constructor.name.replace(/Factory$/, '');
        this.decoratorName = (_a = this.options.decoratorName) !== null && _a !== void 0 ? _a : defaultDecoratorName;
        if (this.options.cloneInputSpec) {
            this.spec = DecoratorFactory.cloneDeep(spec);
        }
    }
    allowInheritance() {
        var _a;
        return !!((_a = this.options) === null || _a === void 0 ? void 0 : _a.allowInheritance);
    }
    /**
     * Inherit metadata from base classes. By default, this method merges base
     * metadata into the spec if `allowInheritance` is set to `true`. To customize
     * the behavior, this method can be overridden by sub classes.
     *
     * @param inheritedMetadata - Metadata from base classes for the member
     */
    inherit(inheritedMetadata) {
        if (!this.allowInheritance())
            return this.spec;
        if (inheritedMetadata == null)
            return this.spec;
        if (this.spec == null)
            return inheritedMetadata;
        if (typeof inheritedMetadata !== 'object')
            return this.spec;
        if (Array.isArray(inheritedMetadata) || Array.isArray(this.spec)) {
            // For arrays, we don't merge
            return this.spec;
        }
        return Object.assign(inheritedMetadata, this.spec);
    }
    /**
     * Get the qualified name of a decoration target.
     *
     * @remarks
     *
     * Example of target names:
     *
     * - class MyClass
     * - MyClass.constructor[0] // First parameter of the constructor
     * - MyClass.myStaticProperty
     * - MyClass.myStaticMethod()
     * - MyClass.myStaticMethod[0] // First parameter of the myStaticMethod
     * - MyClass.prototype.myProperty
     * - MyClass.prototype.myMethod()
     * - MyClass.prototype.myMethod[1] // Second parameter of myMethod
     *
     * @param target - Class or prototype of a class
     * @param member - Optional property/method name
     * @param descriptorOrIndex - Optional method descriptor or parameter index
     */
    static getTargetName(target, member, descriptorOrIndex) {
        let name = target instanceof Function
            ? target.name
            : `${target.constructor.name}.prototype`;
        if (member == null && descriptorOrIndex == null) {
            return `class ${name}`;
        }
        if (member == null || member === '')
            member = 'constructor';
        const memberAccessor = typeof member === 'symbol' ? '[' + member.toString() + ']' : '.' + member;
        if (typeof descriptorOrIndex === 'number') {
            // Parameter
            name = `${name}${memberAccessor}[${descriptorOrIndex}]`;
        }
        else if (descriptorOrIndex != null) {
            name = `${name}${memberAccessor}()`;
        }
        else {
            name = `${name}${memberAccessor}`;
        }
        return name;
    }
    /**
     * Get the number of parameters for a given constructor or method
     * @param target - Class or the prototype
     * @param member - Method name
     */
    static getNumberOfParameters(target, member) {
        if (typeof target === 'function' && !member) {
            // constructor
            return target.length;
        }
        else {
            // target[member] is a function
            const method = target[member];
            return method.length;
        }
    }
    /**
     * Set a reference to the target class or prototype for a given spec if
     * it's an object
     * @param spec - Metadata spec
     * @param target - Target of the decoration. It is a class or the prototype of
     * a class.
     */
    withTarget(spec, target) {
        if (typeof spec === 'object' && spec != null) {
            // Add a hidden property for the `target`
            Object.defineProperty(spec, DecoratorFactory.TARGET, {
                value: target,
                enumerable: false,
                // Make sure it won't be redefined on the same object
                configurable: false,
            });
        }
        return spec;
    }
    /**
     * Get the optional decoration target of a given spec
     * @param spec - Metadata spec
     */
    getTarget(spec) {
        if (typeof spec === 'object' && spec != null) {
            const specWithTarget = spec;
            return specWithTarget[DecoratorFactory.TARGET];
        }
        else {
            return undefined;
        }
    }
    /**
     * This method is called by the default implementation of the decorator
     * function to merge the spec argument from the decoration with the inherited
     * metadata for a class, all properties, all methods, or all method
     * parameters that are decorated by this decorator.
     *
     * It MUST be overridden by subclasses to process inherited metadata.
     *
     * @param inheritedMetadata - Metadata inherited from the base classes
     * @param target - Decoration target
     * @param member - Optional property or method
     * @param descriptorOrIndex - Optional parameter index or method descriptor
     */
    mergeWithInherited(inheritedMetadata, target, member, descriptorOrIndex) {
        throw new Error(`mergeWithInherited() is not implemented for ${this.decoratorName}`);
    }
    /**
     * This method is called by the default implementation of the decorator
     * function to merge the spec argument from the decoration with the own
     * metadata for a class, all properties, all methods, or all method
     * parameters that are decorated by this decorator.
     *
     * It MUST be overridden by subclasses to process own metadata.
     *
     * @param ownMetadata - Own Metadata exists locally on the target
     * @param target - Decoration target
     * @param member - Optional property or method
     * @param descriptorOrIndex - Optional parameter index or method descriptor
     */
    mergeWithOwn(ownMetadata, target, member, descriptorOrIndex) {
        throw new Error(`mergeWithOwn() is not implemented for ${this.decoratorName}`);
    }
    /**
     * Create an error to report if the decorator is applied to the target more
     * than once
     * @param target - Decoration target
     * @param member - Optional property or method
     * @param descriptorOrIndex - Optional parameter index or method descriptor
     */
    duplicateDecorationError(target, member, descriptorOrIndex) {
        const targetName = DecoratorFactory.getTargetName(target, member, descriptorOrIndex);
        return new Error(`${this.decoratorName} cannot be applied more than once on ${targetName}`);
    }
    /**
     * Create a decorator function of the given type. Each sub class MUST
     * implement this method.
     */
    create() {
        throw new Error(`create() is not implemented for ${this.decoratorName}`);
    }
    /**
     * Base implementation of the decorator function
     * @param target - Decorator target
     * @param member - Optional property or method
     * @param descriptorOrIndex - Optional method descriptor or parameter index
     */
    decorate(target, member, descriptorOrIndex) {
        const targetName = DecoratorFactory.getTargetName(target, member, descriptorOrIndex);
        let meta = reflect_1.Reflector.getOwnMetadata(this.key, target);
        if (meta == null && this.allowInheritance()) {
            // Clone the base metadata so that it won't be accidentally
            // mutated by sub classes
            meta = DecoratorFactory.cloneDeep(reflect_1.Reflector.getMetadata(this.key, target));
            meta = this.mergeWithInherited(meta, target, member, descriptorOrIndex);
            /* istanbul ignore if  */
            if (debug.enabled) {
                debug('%s: %j', targetName, meta);
            }
            reflect_1.Reflector.defineMetadata(this.key, meta, target);
        }
        else {
            meta = this.mergeWithOwn(meta, target, member, descriptorOrIndex);
            /* istanbul ignore if  */
            if (debug.enabled) {
                debug('%s: %j', targetName, meta);
            }
            reflect_1.Reflector.defineMetadata(this.key, meta, target);
        }
    }
    /**
     * Create a decorator function
     * @param key - Metadata key
     * @param spec - Metadata object from the decorator function
     * @param options - Options for the decorator
     */
    static _createDecorator(key, spec, options) {
        const inst = new this(key.toString(), spec, options);
        return inst.create();
    }
    static cloneDeep(val) {
        if (typeof val !== 'object')
            return val;
        return lodash_1.default.cloneDeepWith(val, v => {
            if (typeof v !== 'object')
                return v;
            if (v == null)
                return v;
            if (v.constructor != null &&
                !DecoratorFactory._cloneableTypes.includes(v.constructor)) {
                // Do not clone instances of classes/constructors, such as Date
                return v;
            }
            return undefined;
        });
    }
}
exports.DecoratorFactory = DecoratorFactory;
/**
 * A constant to reference the target of a decoration
 */
DecoratorFactory.TARGET = '__decoratorTarget';
// See https://github.com/lodash/lodash/blob/master/.internal/baseClone.js
DecoratorFactory._cloneableTypes = [
    Object,
    Array,
    Set,
    Map,
    RegExp,
    Date,
    Buffer,
    ArrayBuffer,
    Float32Array,
    Float64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint8ClampedArray,
    Uint16Array,
    Uint32Array,
];
/**
 * Factory for class decorators
 */
class ClassDecoratorFactory extends DecoratorFactory {
    mergeWithInherited(inheritedMetadata, target, member, descriptorOrIndex) {
        return this.withTarget(this.inherit(inheritedMetadata), target);
    }
    mergeWithOwn(ownMetadata, target, member, descriptorOrIndex) {
        if (ownMetadata != null) {
            throw this.duplicateDecorationError(target, member, descriptorOrIndex);
        }
        return this.withTarget(this.spec, target);
    }
    create() {
        return (target) => this.decorate(target);
    }
    /**
     * Create a class decorator function
     * @param key - Metadata key
     * @param spec - Metadata object from the decorator function
     * @param options - Options for the decorator
     */
    static createDecorator(key, spec, options) {
        return super._createDecorator(key, spec, options);
    }
}
exports.ClassDecoratorFactory = ClassDecoratorFactory;
/**
 * Factory for property decorators
 */
class PropertyDecoratorFactory extends DecoratorFactory {
    mergeWithInherited(inheritedMetadata, target, propertyName, descriptorOrIndex) {
        inheritedMetadata = inheritedMetadata || {};
        const propertyMeta = this.withTarget(this.inherit(inheritedMetadata[propertyName]), target);
        inheritedMetadata[propertyName] = propertyMeta;
        return inheritedMetadata;
    }
    mergeWithOwn(ownMetadata, target, propertyName, descriptorOrParameterIndex) {
        ownMetadata = ownMetadata || {};
        if (ownMetadata[propertyName] != null) {
            throw this.duplicateDecorationError(target, propertyName, descriptorOrParameterIndex);
        }
        ownMetadata[propertyName] = this.withTarget(this.spec, target);
        return ownMetadata;
    }
    create() {
        return (target, propertyName) => this.decorate(target, propertyName);
    }
    /**
     * Create a property decorator function
     * @param key - Metadata key
     * @param spec - Metadata object from the decorator function
     * @param options - Options for the decorator
     */
    static createDecorator(key, spec, options) {
        return super._createDecorator(key, spec, options);
    }
}
exports.PropertyDecoratorFactory = PropertyDecoratorFactory;
/**
 * Factory for method decorators
 */
class MethodDecoratorFactory extends DecoratorFactory {
    mergeWithInherited(inheritedMetadata, target, methodName, methodDescriptor) {
        inheritedMetadata = inheritedMetadata || {};
        const methodMeta = this.withTarget(this.inherit(inheritedMetadata[methodName]), target);
        inheritedMetadata[methodName] = methodMeta;
        return inheritedMetadata;
    }
    mergeWithOwn(ownMetadata, target, methodName, methodDescriptor) {
        ownMetadata = ownMetadata || {};
        const methodMeta = ownMetadata[methodName];
        if (this.getTarget(methodMeta) === target) {
            throw this.duplicateDecorationError(target, methodName, methodDescriptor);
        }
        // Set the method metadata
        ownMetadata[methodName] = this.withTarget(this.spec, target);
        return ownMetadata;
    }
    create() {
        return (target, methodName, descriptor) => this.decorate(target, methodName, descriptor);
    }
    /**
     * Create a method decorator function
     * @param key - Metadata key
     * @param spec - Metadata object from the decorator function
     * @param options - Options for the decorator
     */
    static createDecorator(key, spec, options) {
        return super._createDecorator(key, spec, options);
    }
}
exports.MethodDecoratorFactory = MethodDecoratorFactory;
/**
 * Factory for parameter decorators
 */
class ParameterDecoratorFactory extends DecoratorFactory {
    getOrInitMetadata(meta, target, methodName) {
        const method = methodName ? methodName : '';
        let methodMeta = meta[method];
        if (methodMeta == null) {
            // Initialize the method metadata
            methodMeta = new Array(DecoratorFactory.getNumberOfParameters(target, methodName)).fill(undefined);
            meta[method] = methodMeta;
        }
        return methodMeta;
    }
    mergeWithInherited(inheritedMetadata, target, methodName, parameterIndex) {
        inheritedMetadata = inheritedMetadata || {};
        const methodMeta = this.getOrInitMetadata(inheritedMetadata, target, methodName);
        const index = parameterIndex;
        methodMeta[index] = this.withTarget(this.inherit(methodMeta[index]), target);
        return inheritedMetadata;
    }
    mergeWithOwn(ownMetadata, target, methodName, parameterIndex) {
        ownMetadata = ownMetadata || {};
        // Find the method metadata
        const methodMeta = this.getOrInitMetadata(ownMetadata, target, methodName);
        const index = parameterIndex;
        if (this.getTarget(methodMeta[index]) === target) {
            throw this.duplicateDecorationError(target, methodName, parameterIndex);
        }
        // Set the parameter metadata
        methodMeta[index] = this.withTarget(this.inherit(methodMeta[index]), target);
        return ownMetadata;
    }
    create() {
        return (target, methodName, parameterIndex) => this.decorate(target, methodName, parameterIndex);
    }
    /**
     * Create a parameter decorator function
     * @param key - Metadata key
     * @param spec - Metadata object from the decorator function
     * @param options - Options for the decorator
     */
    static createDecorator(key, spec, options) {
        return super._createDecorator(key, spec, options);
    }
}
exports.ParameterDecoratorFactory = ParameterDecoratorFactory;
/**
 * Factory for method level parameter decorator.
 *
 * @example
 * For example, the following code uses `@param` to declare two parameters for
 * `greet()`.
 * ```ts
 * class MyController {
 *   @param('name') // Parameter 0
 *   @param('msg')  // Parameter 1
 *   greet() {}
 * }
 * ```
 */
class MethodParameterDecoratorFactory extends DecoratorFactory {
    /**
     * Find the corresponding parameter index for the decoration
     * @param target
     * @param methodName
     * @param methodDescriptor
     */
    getParameterIndex(target, methodName, methodDescriptor) {
        const numOfParams = DecoratorFactory.getNumberOfParameters(target, methodName);
        // Fetch the cached parameter index
        let index = reflect_1.Reflector.getOwnMetadata(`${this.key}:index`, target, methodName);
        // Default to the last parameter
        if (index == null)
            index = numOfParams - 1;
        if (index < 0) {
            // Excessive decorations than the number of parameters detected
            const method = DecoratorFactory.getTargetName(target, methodName, methodDescriptor);
            throw new Error(`${this.decoratorName} is used more than ${numOfParams} time(s) on ${method}`);
        }
        return index;
    }
    mergeWithInherited(inheritedMetadata, target, methodName, methodDescriptor) {
        inheritedMetadata = inheritedMetadata || {};
        const index = this.getParameterIndex(target, methodName, methodDescriptor);
        const inheritedParams = inheritedMetadata[methodName] || new Array(index + 1).fill(undefined);
        if (inheritedParams.length) {
            // First time applied to a method. This is the last parameter of the method
            inheritedParams[index] = this.withTarget(this.inherit(inheritedParams[index]), target);
        }
        // Cache the index to help us position the next parameter
        reflect_1.Reflector.defineMetadata(`${this.key}:index`, index - 1, target, methodName);
        inheritedMetadata[methodName] = inheritedParams;
        return inheritedMetadata;
    }
    mergeWithOwn(ownMetadata, target, methodName, methodDescriptor) {
        ownMetadata = ownMetadata || {};
        const index = this.getParameterIndex(target, methodName, methodDescriptor);
        const params = ownMetadata[methodName] || new Array(index + 1).fill(undefined);
        params[index] = this.withTarget(this.inherit(params[index]), target);
        ownMetadata[methodName] = params;
        // Cache the index to help us position the next parameter
        reflect_1.Reflector.defineMetadata(`${this.key}:index`, index - 1, target, methodName);
        return ownMetadata;
    }
    create() {
        return (target, methodName, descriptor) => this.decorate(target, methodName, descriptor);
    }
    /**
     * Create a method decorator function
     * @param key - Metadata key
     * @param spec - Metadata object from the decorator function
     * @param options - Options for the decorator
     */
    static createDecorator(key, spec, options) {
        return super._createDecorator(key, spec, options);
    }
}
exports.MethodParameterDecoratorFactory = MethodParameterDecoratorFactory;
/**
 *  Factory for an append-array of method-level decorators
 *  The `@response` metadata for a method is an array.
 *  Each item in the array should be a single value, containing
 *  a response code and a single spec or Model.  This should allow:
 *
 * @example
 * ```ts
 *  @response(200, MyFirstModel)
 *  @response(403, [NotAuthorizedReasonOne, NotAuthorizedReasonTwo])
 *  @response(404, NotFoundOne)
 *  @response(404, NotFoundTwo)
 *  @response(409, {schema: {}})
 *  public async myMethod() {}
 * ```
 *
 * In the case that a ResponseObject is passed, it becomes the
 * default for description/content, and if possible, further Models are
 * incorporated as a `oneOf: []` array.
 *
 * In the case that a ReferenceObject is passed, it and it alone is used, since
 * references can be external and we cannot `oneOf` their content.
 *
 * The factory creates and updates an array of items T[], and the getter
 * provides the values as that array.
 */
class MethodMultiDecoratorFactory extends MethodDecoratorFactory {
    mergeWithInherited(inheritedMetadata, target, methodName) {
        inheritedMetadata = inheritedMetadata || {};
        inheritedMetadata[methodName] = this._mergeArray(inheritedMetadata[methodName], this.withTarget(this.spec, target));
        return inheritedMetadata;
    }
    mergeWithOwn(ownMetadata, target, methodName, methodDescriptor) {
        ownMetadata = ownMetadata || {};
        ownMetadata[methodName] = this._mergeArray(ownMetadata[methodName], this.withTarget(this.spec, target));
        return ownMetadata;
    }
    _mergeArray(result, methodMeta) {
        if (!result) {
            if (Array.isArray(methodMeta)) {
                result = methodMeta;
            }
            else {
                result = [methodMeta];
            }
        }
        else {
            if (Array.isArray(methodMeta)) {
                result.push(...methodMeta);
            }
            else {
                result.push(methodMeta);
            }
        }
        return result;
    }
}
exports.MethodMultiDecoratorFactory = MethodMultiDecoratorFactory;
//# sourceMappingURL=decorator-factory.js.map