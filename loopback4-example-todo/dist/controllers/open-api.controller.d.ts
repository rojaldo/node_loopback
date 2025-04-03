import { TriviaQuestion } from '../models/trivia-question.model';
import { TriviaQuestionRepository } from '../repositories/trivia-question.repository';
/**
 * The controller class is generated from OpenAPI spec with operations tagged
 * by <no-tag>.
 *
 */
export declare class OpenApiController {
    repository: TriviaQuestionRepository;
    constructor(repository: TriviaQuestionRepository);
    /**
     * Retrieves trivia questions from the Open Trivia Database with these
  parameters:
  - amount: Number of trivia questions to retrieve.
  - category: Category ID of the trivia questions. A number from 9 to 32.
  - difficulty: Difficulty level of the trivia questions (easy, medium, hard).
  - type: Type of trivia questions (multiple choice, true/false).
  - token: Token for user-specific trivia questions.
  - encode: Encoding type for the trivia questions (url3986, base64, none).
  
     *
     * @param amount Number of trivia questions to retrieve.
     * @param category Category ID of the trivia questions.
     * @param difficulty Difficulty level of the trivia questions.
     * @param type Type of trivia questions, either multiple choice (4) or
  true/false.
     * @param token Token for user-specific trivia questions.
     * @returns OK
     */
    getTriviaQuestions(amount: number, category: number | undefined, difficulty: 'easy' | 'medium' | 'hard' | undefined, type: 'multiple' | 'boolean' | undefined, token: string | undefined): Promise<{
        response_code?: number;
        results?: TriviaQuestion[];
    }>;
    /**
     * Creates a new trivia question in the Open Trivia Database.
     *
     * @param _requestBody
     * @returns Created
     */
    createTriviaQuestion(_requestBody: {
        category?: string;
        type?: string;
        difficulty?: 'easy' | 'medium' | 'hard';
        question?: string;
        correct_answer?: string;
        incorrect_answers?: string[];
    }): Promise<TriviaQuestion>;
}
