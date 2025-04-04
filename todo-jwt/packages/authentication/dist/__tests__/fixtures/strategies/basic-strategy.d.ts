/// <reference types="express" />
import { OASEnhancer, OpenApiSpec, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { AuthenticationStrategy } from '../../../types';
import { BasicAuthenticationUserService } from '../services/basic-auth-user-service';
export interface BasicAuthenticationStrategyCredentials {
    username: string;
    password: string;
}
export declare class BasicAuthenticationStrategy implements AuthenticationStrategy, OASEnhancer {
    private userService;
    name: string;
    constructor(userService: BasicAuthenticationUserService);
    authenticate(request: Request): Promise<UserProfile | undefined>;
    extractCredentials(request: Request): BasicAuthenticationStrategyCredentials;
    modifySpec(spec: OpenApiSpec): OpenApiSpec;
}
