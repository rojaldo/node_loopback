/// <reference types="express" />
import { OASEnhancer, OpenApiSpec, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { AuthenticationStrategy } from '../../../types';
import { JWTService } from '../services/jwt-service';
export declare class JWTAuthenticationStrategy implements AuthenticationStrategy, OASEnhancer {
    tokenService: JWTService;
    name: string;
    constructor(tokenService: JWTService);
    authenticate(request: Request): Promise<UserProfile | undefined>;
    extractCredentials(request: Request): string;
    modifySpec(spec: OpenApiSpec): OpenApiSpec;
}
