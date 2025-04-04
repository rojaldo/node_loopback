import { Component } from '@loopback/core';
import { ModelApiBuilder, ModelApiConfig } from '@loopback/model-api-builder';
import { Model } from '@loopback/rest';
import { BooterApp } from './application';
export declare const buildCalls: object[];
declare class StubModelApiBuilder implements ModelApiBuilder {
    readonly pattern: string;
    build(application: BooterApp, modelClass: typeof Model & {
        prototype: Model;
    }, config: ModelApiConfig): Promise<void>;
}
export declare class StubModelApiBuilderComponent implements Component {
    bindings: import("@loopback/core").Binding<StubModelApiBuilder>[];
}
export declare const samePatternBuildCalls: object[];
declare class SamePatternModelApiBuilder implements ModelApiBuilder {
    readonly pattern: string;
    build(application: BooterApp, modelClass: typeof Model & {
        prototype: Model;
    }, config: ModelApiConfig): Promise<void>;
}
export declare class SamePatternModelApiBuilderComponent implements Component {
    bindings: import("@loopback/core").Binding<SamePatternModelApiBuilder>[];
}
export declare const similarPatternBuildCalls: object[];
declare class SimilarPatternModelApiBuilder implements ModelApiBuilder {
    readonly pattern: string;
    build(application: BooterApp, modelClass: typeof Model & {
        prototype: Model;
    }, config: ModelApiConfig): Promise<void>;
}
export declare class SimilarPatternModelApiBuilderComponent implements Component {
    bindings: import("@loopback/core").Binding<SimilarPatternModelApiBuilder>[];
}
export {};
