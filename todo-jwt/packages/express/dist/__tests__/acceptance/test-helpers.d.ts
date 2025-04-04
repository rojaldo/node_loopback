import { Binding, InterceptorOrKey } from '@loopback/core';
import { Client } from '@loopback/testlab';
import { ExpressApplication } from '../../express.application';
export { default as spy } from '../fixtures/spy.middleware';
export { SpyConfig } from '../fixtures/spy-config';
export type TestFunction = (spyBinding: Binding<unknown>, path?: string) => Promise<unknown>;
export declare class TestHelper {
    readonly app: ExpressApplication;
    client: Client;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    bindController(interceptor?: InterceptorOrKey): void;
    private configureSpy;
    testSpyLog(spyBinding: Binding<unknown>, path?: string): Promise<void>;
    assertSpyLog(path?: string): Promise<void>;
    testSpyMock(spyBinding: Binding<unknown>, path?: string): Promise<void>;
    assertSpyMock(path?: string): Promise<void>;
    testSpyReject(spyBinding: Binding<unknown>, path?: string): Promise<void>;
    private assertSpyReject;
}
