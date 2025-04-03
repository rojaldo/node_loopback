import { Entity } from '@loopback/repository';
/**
 * The model class is generated from OpenAPI schema - TriviaQuestion
 * TriviaQuestion
 */
export declare class TriviaQuestion extends Entity {
    constructor(data?: Partial<TriviaQuestion>);
    /**
     *
     */
    id?: number;
    /**
     *
     */
    category?: string;
    /**
     *
     */
    type?: string;
    /**
     *
     */
    difficulty?: 'easy' | 'medium' | 'hard';
    /**
     *
     */
    question?: string;
    /**
     *
     */
    correct_answer?: string;
    /**
     *
     */
    incorrect_answers?: string[];
}
export interface TriviaQuestionRelations {
}
export type TriviaQuestionWithRelations = TriviaQuestion & TriviaQuestionRelations;
