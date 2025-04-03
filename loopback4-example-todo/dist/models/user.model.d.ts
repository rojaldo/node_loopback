import { Entity } from '@loopback/repository';
export declare class User extends Entity {
    id?: number;
    name: string;
    age?: number;
    constructor(data?: Partial<User>);
}
export interface UserRelations {
}
export type UserWithRelations = User & UserRelations;
