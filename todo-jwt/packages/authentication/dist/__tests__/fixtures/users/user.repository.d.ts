import { User } from './user';
export declare class UserRepository {
    readonly list: {
        [key: string]: User;
    };
    constructor(list: {
        [key: string]: User;
    });
    find(username: string): User | undefined;
}
