"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository-json-schema
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelToJsonSchema = exports.getNavigationalPropertyForRelation = exports.metaToJsonProperty = exports.isArrayType = exports.stringTypeToWrapper = exports.getJsonSchemaRef = exports.getJsonSchema = exports.buildModelCacheKey = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const debug_1 = tslib_1.__importDefault(require("debug"));
const util_1 = require("util");
const keys_1 = require("./keys");
const debug = (0, debug_1.default)('loopback:repository-json-schema:build-schema');
/**
 * @internal
 */
function buildModelCacheKey(options = {}) {
    var _a;
    // Backwards compatibility: preserve cache key "modelOnly"
    if (Object.keys(options).length === 0) {
        return 'modelOnly';
    }
    // New key schema: use the same suffix as we use for schema title
    // For example: "modelPartialWithRelations"
    // Note this new key schema preserves the old key "modelWithRelations"
    return 'model' + ((_a = options.title) !== null && _a !== void 0 ? _a : '') + getTitleSuffix(options);
}
exports.buildModelCacheKey = buildModelCacheKey;
/**
 * Gets the JSON Schema of a TypeScript model/class by seeing if one exists
 * in a cache. If not, one is generated and then cached.
 * @param ctor - Constructor of class to get JSON Schema from
 */
function getJsonSchema(ctor, options) {
    // In the near future the metadata will be an object with
    // different titles as keys
    const cached = core_1.MetadataInspector.getClassMetadata(keys_1.JSON_SCHEMA_KEY, ctor, {
        ownMetadataOnly: true,
    });
    const key = buildModelCacheKey(options);
    let schema = cached === null || cached === void 0 ? void 0 : cached[key];
    if (!schema) {
        // Create new json schema from model
        // if not found in cache for specific key
        schema = modelToJsonSchema(ctor, options);
        if (cached) {
            // Add a new key to the cached schema of the model
            cached[key] = schema;
        }
        else {
            // Define new metadata and set in cache
            core_1.MetadataInspector.defineMetadata(keys_1.JSON_SCHEMA_KEY.key, { [key]: schema }, ctor);
        }
    }
    return schema;
}
exports.getJsonSchema = getJsonSchema;
/**
 * Describe the provided Model as a reference to a definition shared by multiple
 * endpoints. The definition is included in the returned schema.
 *
 * @example
 *
 * ```ts
 * const schema = {
 *   $ref: '/definitions/Product',
 *   definitions: {
 *     Product: {
 *       title: 'Product',
 *       properties: {
 *         // etc.
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param modelCtor - The model constructor (e.g. `Product`)
 * @param options - Additional options
 */
function getJsonSchemaRef(modelCtor, options) {
    const schemaWithDefinitions = getJsonSchema(modelCtor, options);
    const key = schemaWithDefinitions.title;
    // ctor is not a model
    if (!key)
        return schemaWithDefinitions;
    const definitions = Object.assign({}, schemaWithDefinitions.definitions);
    const schema = Object.assign({}, schemaWithDefinitions);
    delete schema.definitions;
    definitions[key] = schema;
    return {
        $ref: `#/definitions/${key}`,
        definitions,
    };
}
exports.getJsonSchemaRef = getJsonSchemaRef;
/**
 * Gets the wrapper function of primitives string, number, and boolean
 * @param type - Name of type
 */
function stringTypeToWrapper(type) {
    if (typeof type === 'function') {
        return type;
    }
    type = type.toLowerCase();
    let wrapper;
    switch (type) {
        case 'number': {
            wrapper = Number;
            break;
        }
        case 'string': {
            wrapper = String;
            break;
        }
        case 'boolean': {
            wrapper = Boolean;
            break;
        }
        case 'array': {
            wrapper = Array;
            break;
        }
        case 'object':
        case 'any': {
            wrapper = Object;
            break;
        }
        case 'date': {
            wrapper = Date;
            break;
        }
        case 'binary':
        case 'buffer': {
            wrapper = Buffer;
            break;
        }
        case 'null': {
            wrapper = repository_1.Null;
            break;
        }
        default: {
            throw new Error('Unsupported type: ' + type);
        }
    }
    return wrapper;
}
exports.stringTypeToWrapper = stringTypeToWrapper;
/**
 * Determines whether a given string or constructor is array type or not
 * @param type - Type as string or wrapper
 */
function isArrayType(type) {
    return type === Array || type === 'array';
}
exports.isArrayType = isArrayType;
/**
 * Converts property metadata into a JSON property definition
 * @param meta
 */
function metaToJsonProperty(meta) {
    const propDef = {};
    let result;
    let propertyType = meta.type;
    if (isArrayType(propertyType) && meta.itemType) {
        if (isArrayType(meta.itemType) && !meta.jsonSchema) {
            throw new Error('You must provide the "jsonSchema" field when define ' +
                'a nested array property');
        }
        result = { type: 'array', items: propDef };
        propertyType = meta.itemType;
    }
    else {
        result = propDef;
    }
    const wrappedType = stringTypeToWrapper(propertyType);
    const resolvedType = (0, repository_1.resolveType)(wrappedType);
    if (resolvedType === Date) {
        Object.assign(propDef, {
            type: 'string',
            format: 'date-time',
        });
    }
    else if (propertyType === 'buffer') {
        Object.assign(propDef, {
            type: 'string',
            format: 'buffer',
        });
    }
    else if (propertyType === 'Binary') {
        Object.assign(propDef, {
            type: 'string',
            format: 'binary',
        });
    }
    else if (propertyType === 'any') {
        // no-op, the json schema for any type is {}
    }
    else if ((0, repository_1.isBuiltinType)(resolvedType)) {
        Object.assign(propDef, {
            type: resolvedType.name.toLowerCase(),
        });
    }
    else {
        Object.assign(propDef, { $ref: `#/definitions/${resolvedType.name}` });
    }
    if (meta.description) {
        Object.assign(propDef, {
            description: meta.description,
        });
    }
    if (meta.jsonSchema) {
        Object.assign(propDef, meta.jsonSchema);
    }
    return result;
}
exports.metaToJsonProperty = metaToJsonProperty;
/**
 * Checks and return navigational property definition for the relation
 * @param relMeta Relation metadata object
 * @param targetRef Schema definition for the target model
 */
function getNavigationalPropertyForRelation(relMeta, targetRef) {
    if (relMeta.targetsMany === true) {
        // Targets an array of object, like, hasMany
        return {
            type: 'array',
            items: targetRef,
        };
    }
    else if (relMeta.targetsMany === false) {
        // Targets single object, like, hasOne, belongsTo
        return targetRef;
    }
    else {
        // targetsMany is undefined or null
        // not allowed if includeRelations is true
        throw new Error(`targetsMany attribute missing for ${relMeta.name}`);
    }
}
exports.getNavigationalPropertyForRelation = getNavigationalPropertyForRelation;
function buildSchemaTitle(ctor, meta, options) {
    if (options.title)
        return options.title;
    const title = meta.title || ctor.name;
    return title + getTitleSuffix(options);
}
/**
 * Checks the options and generates a descriptive suffix using compatible chars
 * @param options json schema options
 */
function getTitleSuffix(options = {}) {
    var _a, _b;
    let suffix = '';
    if ((_a = options.optional) === null || _a === void 0 ? void 0 : _a.length) {
        suffix += `Optional_${options.optional.join('-')}_`;
    }
    else if (options.partial) {
        suffix += 'Partial';
    }
    if ((_b = options.exclude) === null || _b === void 0 ? void 0 : _b.length) {
        suffix += `Excluding_${options.exclude.join('-')}_`;
    }
    if (options.includeRelations) {
        suffix += 'WithRelations';
    }
    return suffix;
}
function stringifyOptions(modelSettings = {}) {
    return (0, util_1.inspect)(modelSettings, {
        depth: Infinity,
        maxArrayLength: Infinity,
        breakLength: Infinity,
    });
}
function isEmptyJson(obj) {
    return !(obj && Object.keys(obj).length);
}
/**
 * Checks the options and generates a descriptive suffix that contains the
 * TypeScript type and options
 * @param typeName - TypeScript's type name
 * @param options - json schema options
 */
function getDescriptionSuffix(typeName, rawOptions = {}) {
    const options = { ...rawOptions };
    delete options.visited;
    if (options.optional && !options.optional.length) {
        delete options.optional;
    }
    const type = typeName;
    let tsType = type;
    if (options.includeRelations) {
        tsType = `${type}WithRelations`;
    }
    if (options.partial) {
        tsType = `Partial<${tsType}>`;
    }
    if (options.exclude) {
        const excludedProps = options.exclude.map(p => `'${String(p)}'`);
        tsType = `Omit<${tsType}, ${excludedProps.join(' | ')}>`;
    }
    if (options.optional) {
        const optionalProps = options.optional.map(p => `'${String(p)}'`);
        tsType = `@loopback/repository-json-schema#Optional<${tsType}, ${optionalProps.join(' | ')}>`;
    }
    return !isEmptyJson(options)
        ? `(tsType: ${tsType}, schemaOptions: ${stringifyOptions(options)})`
        : '';
}
// NOTE(shimks) no metadata for: union, optional, nested array, any, enum,
// string literal, anonymous types, and inherited properties
/**
 * Converts a TypeScript class into a JSON Schema using TypeScript's
 * reflection API
 * @param ctor - Constructor of class to convert from
 */
function modelToJsonSchema(ctor, jsonSchemaOptions = {}) {
    var _a, _b, _c, _d, _e, _f, _g;
    const options = { ...jsonSchemaOptions };
    options.visited = (_a = options.visited) !== null && _a !== void 0 ? _a : {};
    options.optional = (_b = options.optional) !== null && _b !== void 0 ? _b : [];
    const partial = options.partial && !options.optional.length;
    if (options.partial && !partial) {
        debug('Overriding "partial" option with "optional" option');
        delete options.partial;
    }
    debug('Creating schema for model %s', ctor.name);
    debug('JSON schema options: %o', options);
    const modelDef = repository_1.ModelMetadataHelper.getModelMetadata(ctor);
    // returns an empty object if metadata is an empty object
    if (modelDef == null || Object.keys(modelDef).length === 0) {
        return {};
    }
    const meta = modelDef;
    debug('Model settings', meta.settings);
    const title = buildSchemaTitle(ctor, meta, options);
    if (options.visited[title])
        return options.visited[title];
    const result = { title };
    options.visited[title] = result;
    result.type = 'object';
    const descriptionSuffix = getDescriptionSuffix(ctor.name, options);
    if (meta.description) {
        const formatSuffix = descriptionSuffix ? ` ${descriptionSuffix}` : '';
        result.description = meta.description + formatSuffix;
    }
    else if (descriptionSuffix) {
        result.description = descriptionSuffix;
    }
    for (const p in meta.properties) {
        if ((_c = options.exclude) === null || _c === void 0 ? void 0 : _c.includes(p)) {
            debug('Property % is excluded by %s', p, options.exclude);
            continue;
        }
        if (meta.properties[p].type == null) {
            // Circular import of model classes can lead to this situation
            throw new Error(`Property ${ctor.name}.${p} does not have "type" in its definition`);
        }
        result.properties = (_d = result.properties) !== null && _d !== void 0 ? _d : {};
        result.properties[p] = result.properties[p] || {};
        const metaProperty = Object.assign({}, meta.properties[p]);
        // populating "properties" key
        result.properties[p] = metaToJsonProperty(metaProperty);
        // handling 'required' metadata
        const optional = options.optional.includes(p);
        if (metaProperty.required && !(partial || optional)) {
            result.required = (_e = result.required) !== null && _e !== void 0 ? _e : [];
            result.required.push(p);
        }
        // populating JSON Schema 'definitions'
        // shimks: ugly type casting; this should be replaced by logic to throw
        // error if itemType/type is not a string or a function
        const resolvedType = (0, repository_1.resolveType)(metaProperty.type);
        const referenceType = isArrayType(resolvedType)
            ? // shimks: ugly type casting; this should be replaced by logic to throw
                // error if itemType/type is not a string or a function
                typeof metaProperty.itemType === 'string'
                    ? (0, repository_1.resolveType)(metaProperty.itemType)
                    : (0, repository_1.resolveType)(metaProperty.itemType)
            : resolvedType;
        if (typeof referenceType !== 'function' || (0, repository_1.isBuiltinType)(referenceType)) {
            continue;
        }
        const propOptions = { ...options };
        if (propOptions.partial !== 'deep') {
            // Do not cascade `partial` to nested properties
            delete propOptions.partial;
        }
        if (propOptions.includeRelations === true) {
            // Do not cascade `includeRelations` to nested properties
            delete propOptions.includeRelations;
        }
        // `title` is the unique identity of a schema,
        // it should be removed from the `options`
        // when generating the relation or property schemas
        delete propOptions.title;
        // Do not cascade `exclude` to nested properties.
        delete propOptions.exclude;
        const propSchema = getJsonSchema(referenceType, propOptions);
        // JSONSchema6Definition allows both boolean and JSONSchema6 types
        if (typeof result.properties[p] !== 'boolean') {
            const prop = result.properties[p];
            const propTitle = (_f = propSchema.title) !== null && _f !== void 0 ? _f : referenceType.name;
            const targetRef = { $ref: `#/definitions/${propTitle}` };
            if (prop.type === 'array' && prop.items) {
                // Update $ref for array type
                prop.items = targetRef;
            }
            else {
                result.properties[p] = targetRef;
            }
            includeReferencedSchema(propTitle, propSchema);
        }
    }
    result.additionalProperties = meta.settings.strict === false;
    debug('  additionalProperties?', result.additionalProperties);
    if (options.includeRelations) {
        for (const r in meta.relations) {
            result.properties = (_g = result.properties) !== null && _g !== void 0 ? _g : {};
            const relMeta = meta.relations[r];
            const targetType = (0, repository_1.resolveType)(relMeta.target);
            // `title` is the unique identity of a schema,
            // it should be removed from the `options`
            // when generating the relation or property schemas
            const targetOptions = { ...options };
            delete targetOptions.title;
            const targetSchema = getJsonSchema(targetType, targetOptions);
            const targetRef = { $ref: `#/definitions/${targetSchema.title}` };
            const propDef = getNavigationalPropertyForRelation(relMeta, targetRef);
            result.properties[relMeta.name] =
                result.properties[relMeta.name] || propDef;
            if (relMeta.keyFrom) {
                result.properties.foreignKey = relMeta
                    .keyFrom;
            }
            includeReferencedSchema(targetSchema.title, targetSchema);
        }
    }
    function includeReferencedSchema(name, schema) {
        var _a, _b;
        if (!schema || !Object.keys(schema).length)
            return;
        // promote nested definition to the top level
        if (result !== (schema === null || schema === void 0 ? void 0 : schema.definitions)) {
            for (const key in schema.definitions) {
                if (key === title)
                    continue;
                result.definitions = (_a = result.definitions) !== null && _a !== void 0 ? _a : {};
                result.definitions[key] = schema.definitions[key];
            }
            delete schema.definitions;
        }
        if (result !== schema) {
            result.definitions = (_b = result.definitions) !== null && _b !== void 0 ? _b : {};
            result.definitions[name] = schema;
        }
    }
    if (meta.jsonSchema) {
        Object.assign(result, meta.jsonSchema);
    }
    return result;
}
exports.modelToJsonSchema = modelToJsonSchema;
//# sourceMappingURL=build-schema.js.map