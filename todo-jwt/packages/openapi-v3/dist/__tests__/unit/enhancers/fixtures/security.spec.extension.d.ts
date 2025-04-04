import { ReferenceObject, SecuritySchemeObject } from '../../../..';
import { OASEnhancer } from '../../../../enhancers/types';
import { OpenApiSpec } from '../../../../types';
export type SecuritySchemeObjects = {
    [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};
export declare const SECURITY_SCHEME_SPEC: SecuritySchemeObjects;
/**
 * A spec enhancer to add bearer token OpenAPI security entry to
 * `spec.component.securitySchemes`
 */
export declare class SecuritySpecEnhancer implements OASEnhancer {
    name: string;
    modifySpec(spec: OpenApiSpec): OpenApiSpec;
}
