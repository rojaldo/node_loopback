import { BindingKey } from '@loopback/core';
import { BasicAuthenticationUserService } from './services/basic-auth-user-service';
import { JWTService } from './services/jwt-service';
import { UserRepository } from './users/user.repository';
export declare const USER_REPO: BindingKey<UserRepository>;
export declare namespace BasicAuthenticationStrategyBindings {
    const USER_SERVICE: BindingKey<BasicAuthenticationUserService>;
}
export declare namespace JWTAuthenticationStrategyBindings {
    const TOKEN_SECRET: BindingKey<string>;
    const TOKEN_EXPIRES_IN: BindingKey<string>;
    const TOKEN_SERVICE: BindingKey<JWTService>;
}
