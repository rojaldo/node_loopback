import { BindingAddress, BindingKey } from '@loopback/core';
import { RestExplorerComponent } from './rest-explorer.component';
import { RestExplorerConfig } from './rest-explorer.types';
/**
 * Binding keys used by this component.
 */
export declare namespace RestExplorerBindings {
    /**
     * Binding key for RestExplorerComponent
     */
    const COMPONENT: BindingKey<RestExplorerComponent>;
    /**
     * Binding key for configuration of RestExplorerComponent.
     *
     * We recommend `ctx.configure(RestExplorerBindings.COMPONENT)` to be used
     * instead of `ctx.bind(RestExplorerBindings.CONFIG)`.
     */
    const CONFIG: BindingAddress<RestExplorerConfig>;
}
