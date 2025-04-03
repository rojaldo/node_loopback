"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const repository_1 = require("@loopback/repository");
const trivia_question_repository_1 = require("../repositories/trivia-question.repository");
/**
 * The controller class is generated from OpenAPI spec with operations tagged
 * by <no-tag>.
 *
 */
let OpenApiController = class OpenApiController {
    constructor(repository) {
        this.repository = repository;
    }
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
    async getTriviaQuestions(amount, category, difficulty, type, token) {
        let cards = await this.repository.find();
        return {
            response_code: 0,
            results: cards,
        };
    }
    /**
     * Creates a new trivia question in the Open Trivia Database.
     *
     * @param _requestBody
     * @returns Created
     */
    async createTriviaQuestion(_requestBody) {
        return this.repository.create(_requestBody);
    }
};
exports.OpenApiController = OpenApiController;
tslib_1.__decorate([
    (0, rest_1.operation)('get', '/api/v1/cards', {
        summary: 'Get trivia questions',
        operationId: 'getTriviaQuestions',
        description: ' Retrieves trivia questions from the Open Trivia Database with these parameters:\n - amount: Number of trivia questions to retrieve.\n - category: Category ID of the trivia questions. A number from 9 to 32.\n - difficulty: Difficulty level of the trivia questions (easy, medium, hard).\n - type: Type of trivia questions (multiple choice, true/false).\n - token: Token for user-specific trivia questions.\n - encode: Encoding type for the trivia questions (url3986, base64, none).\n ',
        parameters: [
            {
                name: 'amount',
                in: 'query',
                required: true,
                description: 'Number of trivia questions to retrieve.',
                schema: {
                    type: 'integer',
                    example: 10,
                },
            },
            {
                name: 'category',
                in: 'query',
                required: false,
                description: 'Category ID of the trivia questions.',
                schema: {
                    type: 'integer',
                    example: 9,
                },
            },
            {
                name: 'difficulty',
                in: 'query',
                required: false,
                description: 'Difficulty level of the trivia questions.',
                schema: {
                    type: 'string',
                    enum: [
                        'easy',
                        'medium',
                        'hard',
                    ],
                    example: 'medium',
                },
            },
            {
                name: 'type',
                in: 'query',
                required: false,
                description: 'Type of trivia questions, either multiple choice (4) or true/false.',
                schema: {
                    type: 'string',
                    enum: [
                        'multiple',
                        'boolean',
                    ],
                    example: 'multiple',
                },
            },
            {
                name: 'token',
                in: 'query',
                required: false,
                description: 'Token for user-specific trivia questions.',
                schema: {
                    type: 'string',
                    example: 'abc123',
                },
            },
        ],
        responses: {
            '200': {
                description: 'OK',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                response_code: {
                                    type: 'integer',
                                    example: 0,
                                },
                                results: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/TriviaQuestion',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.param)({
        name: 'amount',
        in: 'query',
        required: true,
        description: 'Number of trivia questions to retrieve.',
        schema: {
            type: 'integer',
            example: 10,
        },
    })),
    tslib_1.__param(1, (0, rest_1.param)({
        name: 'category',
        in: 'query',
        required: false,
        description: 'Category ID of the trivia questions.',
        schema: {
            type: 'integer',
            example: 9,
        },
    })),
    tslib_1.__param(2, (0, rest_1.param)({
        name: 'difficulty',
        in: 'query',
        required: false,
        description: 'Difficulty level of the trivia questions.',
        schema: {
            type: 'string',
            enum: [
                'easy',
                'medium',
                'hard',
            ],
            example: 'medium',
        },
    })),
    tslib_1.__param(3, (0, rest_1.param)({
        name: 'type',
        in: 'query',
        required: false,
        description: 'Type of trivia questions, either multiple choice (4) or true/false.',
        schema: {
            type: 'string',
            enum: [
                'multiple',
                'boolean',
            ],
            example: 'multiple',
        },
    })),
    tslib_1.__param(4, (0, rest_1.param)({
        name: 'token',
        in: 'query',
        required: false,
        description: 'Token for user-specific trivia questions.',
        schema: {
            type: 'string',
            example: 'abc123',
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OpenApiController.prototype, "getTriviaQuestions", null);
tslib_1.__decorate([
    (0, rest_1.operation)('post', '/api/v1/cards', {
        summary: 'Create a new trivia question',
        operationId: 'createTriviaQuestion',
        description: 'Creates a new trivia question in the Open Trivia Database.',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            category: {
                                type: 'string',
                                example: 'Science: Computers',
                            },
                            type: {
                                type: 'string',
                                example: 'multiple',
                            },
                            difficulty: {
                                type: 'string',
                                enum: [
                                    'easy',
                                    'medium',
                                    'hard',
                                ],
                                example: 'medium',
                            },
                            question: {
                                type: 'string',
                                example: 'What is the capital of France?',
                            },
                            correct_answer: {
                                type: 'string',
                                example: 'Paris',
                            },
                            incorrect_answers: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    example: [
                                        'London',
                                        'Berlin',
                                        'Madrid',
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            '201': {
                description: 'Created',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/TriviaQuestion',
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        category: {
                            type: 'string',
                            example: 'Science: Computers',
                        },
                        type: {
                            type: 'string',
                            example: 'multiple',
                        },
                        difficulty: {
                            type: 'string',
                            enum: [
                                'easy',
                                'medium',
                                'hard',
                            ],
                            example: 'medium',
                        },
                        question: {
                            type: 'string',
                            example: 'What is the capital of France?',
                        },
                        correct_answer: {
                            type: 'string',
                            example: 'Paris',
                        },
                        incorrect_answers: {
                            type: 'array',
                            items: {
                                type: 'string',
                                example: [
                                    'London',
                                    'Berlin',
                                    'Madrid',
                                ],
                            },
                        },
                    },
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OpenApiController.prototype, "createTriviaQuestion", null);
exports.OpenApiController = OpenApiController = tslib_1.__decorate([
    (0, rest_1.api)({
        components: {
            schemas: {
                TriviaQuestion: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        category: {
                            type: 'string',
                            example: 'Science: Computers',
                        },
                        type: {
                            type: 'string',
                            example: 'multiple',
                        },
                        difficulty: {
                            type: 'string',
                            enum: [
                                'easy',
                                'medium',
                                'hard',
                            ],
                            example: 'medium',
                        },
                        question: {
                            type: 'string',
                            example: 'What is the capital of France?',
                        },
                        correct_answer: {
                            type: 'string',
                            example: 'Paris',
                        },
                        incorrect_answers: {
                            type: 'array',
                            items: {
                                type: 'string',
                                example: [
                                    'London',
                                    'Berlin',
                                    'Madrid',
                                ],
                            },
                        },
                    },
                },
            },
        },
        paths: {},
    }),
    tslib_1.__param(0, (0, repository_1.repository)(trivia_question_repository_1.TriviaQuestionRepository)),
    tslib_1.__metadata("design:paramtypes", [trivia_question_repository_1.TriviaQuestionRepository])
], OpenApiController);
//# sourceMappingURL=open-api.controller.js.map