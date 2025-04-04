/// <reference types="express" />
import { Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { AuthenticationStrategy } from '../../../types';
/**
 * Test fixture for a mock asynchronous authentication strategy
 */
export declare class MockStrategy implements AuthenticationStrategy {
    name: string;
    private mockUser;
    setMockUser(userObj: UserProfile): void;
    returnMockUser(): UserProfile;
    authenticate(req: Request): Promise<UserProfile | undefined>;
    /**
     * @param req
     * mock verification function
     *
     * For the purpose of mock tests we have this here
     * pass req.query.testState = 'fail' to mock failed authorization
     * pass req.query.testState = 'error' to mock unexpected error
     */
    verify(request: Request): Promise<UserProfile | undefined>;
}
export declare class MockStrategy2 implements AuthenticationStrategy {
    name: string;
    authenticate(request: Request): Promise<UserProfile | undefined>;
}
