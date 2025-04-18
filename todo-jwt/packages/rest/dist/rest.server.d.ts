/// <reference types="node" />
import { Application, Binding, BindingAddress, Constructor, Server } from '@loopback/core';
import { BaseMiddlewareRegistry, ExpressRequestHandler } from '@loopback/express';
import { HttpServer, HttpServerOptions } from '@loopback/http-server';
import { OASEnhancerService, OpenApiSpec, OperationObject, ServerObject } from '@loopback/openapi-v3';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import { PathParams } from 'express-serve-static-core';
import { IncomingMessage, ServerResponse } from 'http';
import { ServeStaticOptions } from 'serve-static';
import { BodyParser } from './body-parsers';
import { HttpHandler } from './http-handler';
import { RequestContext } from './request-context';
import { ControllerClass, ControllerFactory, ControllerInstance, RestRouterOptions, RouteEntry, RouterSpec } from './router';
import { SequenceFunction, SequenceHandler } from './sequence';
import { Request, RequestBodyParserOptions, Response } from './types';
export type HttpRequestListener = (req: IncomingMessage, res: ServerResponse) => void;
export interface HttpServerLike {
    requestHandler: HttpRequestListener;
}
/**
 * A REST API server for use with Loopback.
 * Add this server to your application by importing the RestComponent.
 *
 * @example
 * ```ts
 * const app = new MyApplication();
 * app.component(RestComponent);
 * ```
 *
 * To add additional instances of RestServer to your application, use the
 * `.server` function:
 * ```ts
 * app.server(RestServer, 'nameOfYourServer');
 * ```
 *
 * By default, one instance of RestServer will be created when the RestComponent
 * is bootstrapped. This instance can be retrieved with
 * `app.getServer(RestServer)`, or by calling `app.get('servers.RestServer')`
 * Note that retrieving other instances of RestServer must be done using the
 * server's name:
 * ```ts
 * const server = await app.getServer('foo')
 * // OR
 * const server = await app.get('servers.foo');
 * ```
 */
export declare class RestServer extends BaseMiddlewareRegistry implements Server, HttpServerLike {
    /**
     * Handle incoming HTTP(S) request by invoking the corresponding
     * Controller method via the configured Sequence.
     *
     * @example
     *
     * ```ts
     * const app = new Application();
     * app.component(RestComponent);
     * // setup controllers, etc.
     *
     * const restServer = await app.getServer(RestServer);
     * const httpServer = http.createServer(restServer.requestHandler);
     * httpServer.listen(3000);
     * ```
     *
     * @param req - The request.
     * @param res - The response.
     */
    protected oasEnhancerService: OASEnhancerService;
    get OASEnhancer(): OASEnhancerService;
    protected _requestHandler: HttpRequestListener;
    get requestHandler(): HttpRequestListener;
    readonly config: RestServerResolvedConfig;
    private _basePath;
    protected _httpHandler: HttpHandler;
    protected get httpHandler(): HttpHandler;
    /**
     * Context event subscriptions for route related changes
     */
    private _routesEventSubscription;
    protected _httpServer: HttpServer | undefined;
    protected _expressApp?: express.Application;
    get listening(): boolean;
    get httpServer(): HttpServer | undefined;
    /**
     * The base url for the server, including the basePath if set. For example,
     * the value will be 'http://localhost:3000/api' if `basePath` is set to
     * '/api'.
     */
    get url(): string | undefined;
    /**
     * The root url for the server without the basePath. For example, the value
     * will be 'http://localhost:3000' regardless of the `basePath`.
     */
    get rootUrl(): string | undefined;
    /**
     *
     * Creates an instance of RestServer.
     *
     * @param app - The application instance (injected via
     * CoreBindings.APPLICATION_INSTANCE).
     * @param config - The configuration options (injected via
     * RestBindings.CONFIG).
     *
     */
    constructor(app: Application, config?: RestServerConfig);
    protected _setupOASEnhancerIfNeeded(): void;
    protected _setupRequestHandlerIfNeeded(): void;
    /**
     * Get an Express handler for unexpected errors
     */
    protected _unexpectedErrorHandler(): ErrorRequestHandler;
    /**
     * Apply express settings.
     */
    protected _applyExpressSettings(): void;
    /**
     * Mount /openapi.json, /openapi.yaml for specs and /swagger-ui, /explorer
     * to redirect to externally hosted API explorer
     */
    protected _setupOpenApiSpecEndpoints(): void;
    /**
     * Add a new non-controller endpoint hosting a form of the OpenAPI spec.
     *
     * @param path Path at which to host the copy of the OpenAPI
     * @param form Form that should be rendered from that path
     */
    addOpenApiSpecEndpoint(path: string, form: OpenApiSpecForm, router?: express.Router): void;
    protected _handleHttpRequest(request: Request, response: Response): Promise<void>;
    protected _setupHandlerIfNeeded(): void;
    /**
     * Create an instance of HttpHandler and populates it with routes
     */
    private _createHttpHandler;
    private _setupOperation;
    private _serveOpenApiSpec;
    private _redirectToSwaggerUI;
    /**
     * Register a controller class with this server.
     *
     * @param controllerCtor - The controller class
     * (constructor function).
     * @returns The newly created binding, you can use the reference to
     * further modify the binding, e.g. lock the value to prevent further
     * modifications.
     *
     * @example
     * ```ts
     * class MyController {
     * }
     * app.controller(MyController).lock();
     * ```
     *
     */
    controller(controllerCtor: ControllerClass<ControllerInstance>): Binding;
    /**
     * Register a new Controller-based route.
     *
     * @example
     * ```ts
     * class MyController {
     *   greet(name: string) {
     *     return `hello ${name}`;
     *   }
     * }
     * app.route('get', '/greet', operationSpec, MyController, 'greet');
     * ```
     *
     * @param verb - HTTP verb of the endpoint
     * @param path - URL path of the endpoint
     * @param spec - The OpenAPI spec describing the endpoint (operation)
     * @param controllerCtor - Controller constructor
     * @param controllerFactory - A factory function to create controller instance
     * @param methodName - The name of the controller method
     */
    route<I extends object>(verb: string, path: string, spec: OperationObject, controllerCtor: ControllerClass<I>, controllerFactory: ControllerFactory<I>, methodName: string): Binding;
    /**
     * Register a new route invoking a handler function.
     *
     * @example
     * ```ts
     * function greet(name: string) {
     *  return `hello ${name}`;
     * }
     * app.route('get', '/', operationSpec, greet);
     * ```
     *
     * @param verb - HTTP verb of the endpoint
     * @param path - URL path of the endpoint
     * @param spec - The OpenAPI spec describing the endpoint (operation)
     * @param handler - The function to invoke with the request parameters
     * described in the spec.
     */
    route(verb: string, path: string, spec: OperationObject, handler: Function): Binding;
    /**
     * Register a new generic route.
     *
     * @example
     * ```ts
     * function greet(name: string) {
     *  return `hello ${name}`;
     * }
     * const route = new Route('get', '/', operationSpec, greet);
     * app.route(route);
     * ```
     *
     * @param route - The route to add.
     */
    route(route: RouteEntry): Binding;
    private bindRoute;
    /**
     * Register a route redirecting callers to a different URL.
     *
     * @example
     * ```ts
     * server.redirect('/explorer', '/explorer/');
     * ```
     *
     * @param fromPath - URL path of the redirect endpoint
     * @param toPathOrUrl - Location (URL path or full URL) where to redirect to.
     * If your server is configured with a custom `basePath`, then the base path
     * is prepended to the target location.
     * @param statusCode - HTTP status code to respond with,
     *   defaults to 303 (See Other).
     */
    redirect(fromPath: string, toPathOrUrl: string, statusCode?: number): Binding;
    private _externalRoutes;
    /**
     * Mount static assets to the REST server.
     * See https://expressjs.com/en/4x/api.html#express.static
     * @param path - The path(s) to serve the asset.
     * See examples at https://expressjs.com/en/4x/api.html#path-examples
     * @param rootDir - The root directory from which to serve static assets
     * @param options - Options for serve-static
     */
    static(path: PathParams, rootDir: string, options?: ServeStaticOptions): void;
    /**
     * Set the OpenAPI specification that defines the REST API schema for this
     * server. All routes, parameter definitions and return types will be defined
     * in this way.
     *
     * Note that this will override any routes defined via decorators at the
     * controller level (this function takes precedent).
     *
     * @param spec - The OpenAPI specification, as an object.
     * @returns Binding for the spec
     *
     */
    api(spec: OpenApiSpec): Binding;
    /**
     * Get the OpenAPI specification describing the REST API provided by
     * this application.
     *
     * This method merges operations (HTTP endpoints) from the following sources:
     *  - `app.api(spec)`
     *  - `app.controller(MyController)`
     *  - `app.route(route)`
     *  - `app.route('get', '/greet', operationSpec, MyController, 'greet')`
     *
     * If the optional `requestContext` is provided, then the `servers` list
     * in the returned spec will be updated to work in that context.
     * Specifically:
     * 1. if `config.openApi.setServersFromRequest` is enabled, the servers
     * list will be replaced with the context base url
     * 2. Any `servers` entries with a path of `/` will have that path
     * replaced with `requestContext.basePath`
     *
     * @param requestContext - Optional context to update the `servers` list
     * in the returned spec
     */
    getApiSpec(requestContext?: RequestContext): Promise<OpenApiSpec>;
    /**
     * Update or rebuild OpenAPI Spec object to be appropriate for the context of
     * a specific request for the spec, leveraging both app config and request
     * path information.
     *
     * @param spec base spec object from which to start
     * @param requestContext request to use to infer path information
     * @returns Updated or rebuilt spec object to use in the context of the request
     */
    private updateSpecFromRequest;
    /**
     * Configure a custom sequence class for handling incoming requests.
     *
     * @example
     * ```ts
     * class MySequence implements SequenceHandler {
     *   constructor(
     *     @inject('send) public send: Send)) {
     *   }
     *
     *   public async handle({response}: RequestContext) {
     *     send(response, 'hello world');
     *   }
     * }
     * ```
     *
     * @param sequenceClass - The sequence class to invoke for each incoming request.
     */
    sequence(sequenceClass: Constructor<SequenceHandler>): Binding<SequenceHandler>;
    /**
     * Configure a custom sequence function for handling incoming requests.
     *
     * @example
     * ```ts
     * app.handler(({request, response}, sequence) => {
     *   sequence.send(response, 'hello world');
     * });
     * ```
     *
     * @param handlerFn - The handler to invoke for each incoming request.
     */
    handler(handlerFn: SequenceFunction): void;
    /**
     * Bind a body parser to the server context
     * @param parserClass - Body parser class
     * @param address - Optional binding address
     */
    bodyParser(bodyParserClass: Constructor<BodyParser>, address?: BindingAddress<BodyParser>): Binding<BodyParser>;
    /**
     * Configure the `basePath` for the rest server
     * @param path - Base path
     */
    basePath(path?: string): void;
    /**
     * Start this REST API's HTTP/HTTPS server.
     */
    start(): Promise<void>;
    /**
     * Stop this REST API's HTTP/HTTPS server.
     */
    stop(): Promise<void>;
    /**
     * Mount an Express router to expose additional REST endpoints handled
     * via legacy Express-based stack.
     *
     * @param basePath - Path where to mount the router at, e.g. `/` or `/api`.
     * @param router - The Express router to handle the requests.
     * @param spec - A partial OpenAPI spec describing endpoints provided by the
     * router. LoopBack will prepend `basePath` to all endpoints automatically.
     * This argument is optional. You can leave it out if you don't want to
     * document the routes.
     */
    mountExpressRouter(basePath: string, router: ExpressRequestHandler, spec?: RouterSpec): void;
    /**
     * Export the OpenAPI spec to the given json or yaml file
     * @param outFile - File name for the spec. The extension of the file
     * determines the format of the file.
     * - `yaml` or `yml`: YAML
     * - `json` or other: JSON
     * If the outFile is not provided or its value is `''` or `'-'`, the spec is
     * written to the console using the `log` function.
     * @param log - Log function, default to `console.log`
     */
    exportOpenApiSpec(outFile?: string, log?: (message?: any, ...optionalParams: any[]) => void): Promise<void>;
}
/**
 * Create a binding for the given body parser class
 * @param parserClass - Body parser class
 * @param key - Optional binding address
 */
export declare function createBodyParserBinding(parserClass: Constructor<BodyParser>, key?: BindingAddress<BodyParser>): Binding<BodyParser>;
/**
 * The form of OpenAPI specs to be served
 */
export interface OpenApiSpecForm {
    version?: string;
    format?: string;
}
/**
 * Options to customize how OpenAPI specs are served
 */
export interface OpenApiSpecOptions {
    /**
     * Mapping of urls to spec forms, by default:
     * <br>
     * {
     *   <br>
     *   '/openapi.json': {version: '3.0.0', format: 'json'},
     *   <br>
     *   '/openapi.yaml': {version: '3.0.0', format: 'yaml'},
     *   <br>
     * }
     *
     */
    endpointMapping?: {
        [key: string]: OpenApiSpecForm;
    };
    /**
     * A flag to force `servers` to be set from the http request for the OpenAPI
     * spec
     */
    setServersFromRequest?: boolean;
    /**
     * Configure servers for OpenAPI spec
     */
    servers?: ServerObject[];
    /**
     * Set this flag to disable the endpoint for OpenAPI spec
     */
    disabled?: true;
    /**
     * Set this flag to `false` to disable OAS schema consolidation. If not set,
     * the value defaults to `true`.
     */
    consolidate?: boolean;
}
export interface ApiExplorerOptions {
    /**
     * URL for the hosted API explorer UI
     * default to https://loopback.io/api-explorer
     */
    url?: string;
    /**
     * URL for the API explorer served over `http` protocol to deal with mixed
     * content security imposed by browsers as the spec is exposed over `http` by
     * default.
     * See https://github.com/loopbackio/loopback-next/issues/1603
     */
    httpUrl?: string;
    /**
     * Set this flag to disable the built-in redirect to externally
     * hosted API Explorer UI.
     */
    disabled?: true;
}
/**
 * RestServer options
 */
export type RestServerOptions = Partial<RestServerResolvedOptions>;
export interface RestServerResolvedOptions {
    port: number;
    path?: string;
    /**
     * Base path for API/static routes
     */
    basePath?: string;
    cors: cors.CorsOptions;
    openApiSpec: OpenApiSpecOptions;
    apiExplorer: ApiExplorerOptions;
    requestBodyParser?: RequestBodyParserOptions;
    sequence?: Constructor<SequenceHandler>;
    expressSettings: {
        [name: string]: any;
    };
    router: RestRouterOptions;
    /**
     * Set this flag to `false` to not listen on connections when the REST server
     * is started. It's useful to mount a LoopBack REST server as a route to the
     * facade Express application. If not set, the value is default to `true`.
     */
    listenOnStart?: boolean;
}
/**
 * Valid configuration for the RestServer constructor.
 */
export type RestServerConfig = RestServerOptions & HttpServerOptions;
export type RestServerResolvedConfig = RestServerResolvedOptions & HttpServerOptions;
