import { OASEnhancer, OpenApiSpec } from '../../../..';
/**
 * A spec enhancer to add OpenAPI info spec
 */
export declare class InfoSpecEnhancer implements OASEnhancer {
    name: string;
    modifySpec(spec: OpenApiSpec): OpenApiSpec;
}
