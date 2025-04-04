import { RestApplication } from '@loopback/rest';
import { UserProfileFactory } from '../../types';
import { User } from './users/user';
import { UserRepository } from './users/user.repository';
/**
 * Returns an application that has loaded the authentication and rest components
 */
export declare function getApp(): RestApplication;
/**
 * Returns a stub user repository
 */
export declare function getUserRepository(): UserRepository;
/**
 * Creates a Basic Authorization header value
 *   Uses 'Basic ' as the prefix, unless another is provided
 *   Uses ':' as a separator, unless another is provided
 *   Can add an extra segment to create an invalid base64 string (for testing purposes)
 */
export interface BasicAuthorizationHeaderValueOptions {
    prefix?: string;
    separator?: string;
    extraSegment?: string;
}
export declare function createBasicAuthorizationHeaderValue(user: User, options?: BasicAuthorizationHeaderValueOptions): string;
export declare function createBearerAuthorizationHeaderValue(token: string, alternativePrefix?: string): string;
/**
 * Convert a User instance to an object in type UserProfile
 * @param user
 */
export declare const myUserProfileFactory: UserProfileFactory<User>;
