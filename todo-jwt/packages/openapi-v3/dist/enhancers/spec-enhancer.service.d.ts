import { Getter } from '@loopback/core';
import { OpenApiSpec, SecuritySchemeObject } from '../types';
import { OASEnhancer } from './types';
/**
 * Options for the OpenAPI Spec enhancer extension point
 */
export interface OASEnhancerServiceOptions {
}
/**
 * An extension point for OpenAPI Spec enhancement
 * This service is used for enhancing an OpenAPI spec by loading and applying one or more
 * registered enhancers.
 *
 * A typical use of it would be generating the OpenAPI spec for the endpoints on a server
 * in the `@loopback/rest` module.
 */
export declare class OASEnhancerService {
    /**
     * Inject a getter function to fetch spec enhancers
     */
    private getEnhancers;
    /**
     * An extension point should be able to receive its options via dependency
     * injection.
     */
    readonly options?: OASEnhancerServiceOptions | undefined;
    constructor(
    /**
     * Inject a getter function to fetch spec enhancers
     */
    getEnhancers: Getter<OASEnhancer[]>, 
    /**
     * An extension point should be able to receive its options via dependency
     * injection.
     */
    options?: OASEnhancerServiceOptions | undefined);
    private _spec;
    /**
     * Getter for `_spec`
     */
    get spec(): OpenApiSpec;
    /**
     * Setter for `_spec`
     */
    set spec(value: OpenApiSpec);
    /**
     * Find an enhancer by its name
     * @param name The name of the enhancer you want to find
     */
    getEnhancerByName<T extends OASEnhancer = OASEnhancer>(name: string): Promise<T | undefined>;
    /**
     * Apply a given enhancer's merge function. Return the latest _spec.
     * @param name The name of the enhancer you want to apply
     */
    applyEnhancerByName(name: string): Promise<OpenApiSpec>;
    /**
     * Generate OpenAPI spec by applying ALL registered enhancers
     * TBD: load enhancers by group names
     */
    applyAllEnhancers(options?: {}): Promise<OpenApiSpec>;
}
/**
 * The default merge function to patch the current OpenAPI spec.
 * It leverages module `json-merge-patch`'s merge API to merge two json objects.
 * It returns a new merged object without modifying the original one.
 *
 * A list of merging rules can be found in test file:
 * https://github.com/pierreinglebert/json-merge-patch/blob/master/test/lib/merge.js
 *
 * @param currentSpec The original spec
 * @param patchSpec The patch spec to be merged into the original spec
 * @returns A new specification object created by merging the original ones.
 */
export declare function mergeOpenAPISpec<C extends Partial<OpenApiSpec>, P extends Partial<OpenApiSpec>>(currentSpec: C, patchSpec: P): C & P;
/**
 * Security scheme merge helper function to patch the current OpenAPI spec.
 * It provides a direct route to add a security schema to the specs components.
 * It returns a new merged object without modifying the original one.
 *
 * @param currentSpec The original spec
 * @param schemeName The name of the security scheme to be added
 * @param schemeSpec The security scheme spec body to be added,
 */
export declare function mergeSecuritySchemeToSpec(spec: OpenApiSpec, schemeName: string, schemeSpec: SecuritySchemeObject): OpenApiSpec;
