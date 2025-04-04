import { UserProfile } from '@loopback/security';
import { TokenService } from '../../../services/token.service';
export declare class JWTService implements TokenService {
    private jwtSecret;
    private jwtExpiresIn;
    constructor(jwtSecret: string, jwtExpiresIn: string);
    verifyToken(token: string): Promise<UserProfile>;
    generateToken(userProfile: UserProfile | undefined): Promise<string>;
}
