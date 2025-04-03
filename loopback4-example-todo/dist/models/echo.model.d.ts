import { Model } from '@loopback/repository';
export declare class Echo extends Model {
    message: string;
    timestamp: string;
    status: string;
    constructor(data?: Partial<Echo>);
}
export interface EchoRelations {
}
export type EchoWithRelations = Echo & EchoRelations;
