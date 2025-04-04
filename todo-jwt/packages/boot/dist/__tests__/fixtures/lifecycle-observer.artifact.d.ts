import { LifeCycleObserver } from '@loopback/core';
/**
 * An mock-up `LifeCycleObserver`. Please note that `start` and `stop` methods
 * can be async or sync.
 */
export declare class MyLifeCycleObserver implements LifeCycleObserver {
    status: string;
    /**
     * Handling `start` event asynchronously
     */
    start(): Promise<void>;
    /**
     * Handling `stop` event synchronously.
     */
    stop(): void;
}
