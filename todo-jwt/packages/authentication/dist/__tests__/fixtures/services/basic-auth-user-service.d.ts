import { UserProfile } from '@loopback/security';
import { UserService } from '../../../services/user.service';
import { UserProfileFactory } from '../../../types';
import { BasicAuthenticationStrategyCredentials } from '../strategies/basic-strategy';
import { User } from '../users/user';
import { UserRepository } from '../users/user.repository';
export declare class BasicAuthenticationUserService implements UserService<User, BasicAuthenticationStrategyCredentials> {
    private userRepository;
    userProfileFactory: UserProfileFactory<User>;
    constructor(userRepository: UserRepository, userProfileFactory: UserProfileFactory<User>);
    verifyCredentials(credentials: BasicAuthenticationStrategyCredentials): Promise<User>;
    convertToUserProfile(user: User): UserProfile;
}
