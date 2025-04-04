import { Application } from '@loopback/core';
import { OASEnhancerService } from '../../../..';
export declare class SpecServiceApplication extends Application {
    constructor();
    main(): Promise<void>;
    getSpecService(): Promise<OASEnhancerService>;
}
