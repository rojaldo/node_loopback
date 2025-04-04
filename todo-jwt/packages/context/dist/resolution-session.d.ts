import { Binding } from './binding';
import { BindingSelector } from './binding-filter';
import { Context } from './context';
import { Injection, InjectionMetadata } from './inject';
import { BoundValue, ValueOrPromise } from './value-promise';
/**
 * A function to be executed with the resolution session
 */
export type ResolutionAction = (session: ResolutionSession) => ValueOrPromise<BoundValue>;
/**
 * Wrapper for bindings tracked by resolution sessions
 */
export interface BindingElement {
    type: 'binding';
    value: Readonly<Binding>;
}
/**
 * Wrapper for injections tracked by resolution sessions
 */
export interface InjectionElement {
    type: 'injection';
    value: Readonly<Injection>;
}
export interface InjectionDescriptor {
    targetName: string;
    bindingSelector: BindingSelector;
    metadata: InjectionMetadata;
}
/**
 * Binding or injection elements tracked by resolution sessions
 */
export type ResolutionElement = BindingElement | InjectionElement;
/**
 * Object to keep states for a session to resolve bindings and their
 * dependencies within a context
 */
export declare class ResolutionSession {
    /**
     * A stack of bindings for the current resolution session. It's used to track
     * the path of dependency resolution and detect circular dependencies.
     */
    readonly stack: ResolutionElement[];
    /**
     * Fork the current session so that a new one with the same stack can be used
     * in parallel or future resolutions, such as multiple method arguments,
     * multiple properties, or a getter function
     * @param session - The current session
     */
    static fork(session?: ResolutionSession): ResolutionSession | undefined;
    /**
     * Run the given action with the given binding and session
     * @param action - A function to do some work with the resolution session
     * @param binding - The current binding
     * @param session - The current resolution session
     */
    static runWithBinding(action: ResolutionAction, binding: Readonly<Binding>, session?: ResolutionSession): any;
    /**
     * Run the given action with the given injection and session
     * @param action - A function to do some work with the resolution session
     * @param binding - The current injection
     * @param session - The current resolution session
     */
    static runWithInjection(action: ResolutionAction, injection: Readonly<Injection>, session?: ResolutionSession): any;
    /**
     * Describe the injection for debugging purpose
     * @param injection - Injection object
     */
    static describeInjection(injection: Readonly<Injection>): InjectionDescriptor;
    /**
     * Push the injection onto the session
     * @param injection - Injection The current injection
     */
    pushInjection(injection: Readonly<Injection>): void;
    /**
     * Pop the last injection
     */
    popInjection(): Readonly<Injection<any>>;
    /**
     * Getter for the current injection
     */
    get currentInjection(): Readonly<Injection> | undefined;
    /**
     * Getter for the current binding
     */
    get currentBinding(): Readonly<Binding> | undefined;
    /**
     * Enter the resolution of the given binding. If
     * @param binding - Binding
     */
    pushBinding(binding: Readonly<Binding>): void;
    /**
     * Exit the resolution of a binding
     */
    popBinding(): Readonly<Binding>;
    /**
     * Getter for bindings on the stack
     */
    get bindingStack(): Readonly<Binding>[];
    /**
     * Getter for injections on the stack
     */
    get injectionStack(): Readonly<Injection>[];
    /**
     * Get the binding path as `bindingA --> bindingB --> bindingC`.
     */
    getBindingPath(): string;
    /**
     * Get the injection path as `injectionA --> injectionB --> injectionC`.
     */
    getInjectionPath(): string;
    /**
     * Get the resolution path including bindings and injections, for example:
     * `bindingA --> @ClassA[0] --> bindingB --> @ClassB.prototype.prop1
     * --> bindingC`.
     */
    getResolutionPath(): string;
    toString(): string;
}
/**
 * Options for binding/dependency resolution
 */
export interface ResolutionOptions {
    /**
     * A session to track bindings and injections
     */
    session?: ResolutionSession;
    /**
     * A boolean flag to indicate if the dependency is optional. If it's set to
     * `true` and the binding is not bound in a context, the resolution
     * will return `undefined` instead of throwing an error.
     */
    optional?: boolean;
    /**
     * A boolean flag to control if a proxy should be created to apply
     * interceptors for the resolved value. It's only honored for bindings backed
     * by a class.
     */
    asProxyWithInterceptors?: boolean;
}
/**
 * Resolution options or session
 */
export type ResolutionOptionsOrSession = ResolutionOptions | ResolutionSession;
/**
 * Normalize ResolutionOptionsOrSession to ResolutionOptions
 * @param optionsOrSession - resolution options or session
 */
export declare function asResolutionOptions(optionsOrSession?: ResolutionOptionsOrSession): ResolutionOptions;
/**
 * Contextual metadata for resolution
 */
export interface ResolutionContext<T = unknown> {
    /**
     * The context for resolution
     */
    readonly context: Context;
    /**
     * The binding to be resolved
     */
    readonly binding: Readonly<Binding<T>>;
    /**
     * The options used for resolution
     */
    readonly options: ResolutionOptions;
}
/**
 * Error for context binding resolutions and dependency injections
 */
export declare class ResolutionError extends Error {
    readonly resolutionCtx: Partial<ResolutionContext>;
    constructor(message: string, resolutionCtx: Partial<ResolutionContext>);
    private static buildDetails;
    /**
     * Build the error message for the resolution to include more contextual data
     * @param reason - Cause of the error
     * @param resolutionCtx - Resolution context
     */
    private static buildMessage;
    private static describeResolutionContext;
}
