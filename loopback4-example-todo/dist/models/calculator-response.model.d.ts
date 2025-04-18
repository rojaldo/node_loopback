import { Model } from '@loopback/repository';
export declare class CalculatorResponse extends Model {
    response: number;
    timestamp: string;
    constructor(data?: Partial<CalculatorResponse>);
}
export interface CalculatorResponseRelations {
}
export type CalculatorResponseWithRelations = CalculatorResponse & CalculatorResponseRelations;
