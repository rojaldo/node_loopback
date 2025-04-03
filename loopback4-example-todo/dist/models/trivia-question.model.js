"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriviaQuestion = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
/**
 * The model class is generated from OpenAPI schema - TriviaQuestion
 * TriviaQuestion
 */
let TriviaQuestion = class TriviaQuestion extends repository_1.Entity {
    constructor(data) {
        super(data);
        if (data != null && typeof data === 'object') {
            Object.assign(this, data);
        }
    }
};
exports.TriviaQuestion = TriviaQuestion;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        id: true,
        generated: true,
        jsonSchema: {
            type: 'integer',
        }
    }),
    tslib_1.__metadata("design:type", Number)
], TriviaQuestion.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({ jsonSchema: {
            type: 'string',
        } }),
    tslib_1.__metadata("design:type", String)
], TriviaQuestion.prototype, "category", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({ jsonSchema: {
            type: 'string',
        } }),
    tslib_1.__metadata("design:type", String)
], TriviaQuestion.prototype, "type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({ jsonSchema: {
            type: 'string',
            enum: [
                'easy',
                'medium',
                'hard',
            ],
        } }),
    tslib_1.__metadata("design:type", String)
], TriviaQuestion.prototype, "difficulty", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({ jsonSchema: {
            type: 'string',
        } }),
    tslib_1.__metadata("design:type", String)
], TriviaQuestion.prototype, "question", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({ jsonSchema: {
            type: 'string',
        } }),
    tslib_1.__metadata("design:type", String)
], TriviaQuestion.prototype, "correct_answer", void 0);
tslib_1.__decorate([
    repository_1.property.array(String, { jsonSchema: {
            type: 'array',
            items: {
                type: 'string',
            },
        } }),
    tslib_1.__metadata("design:type", Array)
], TriviaQuestion.prototype, "incorrect_answers", void 0);
exports.TriviaQuestion = TriviaQuestion = tslib_1.__decorate([
    (0, repository_1.model)({ name: 'TriviaQuestion' }),
    tslib_1.__metadata("design:paramtypes", [Object])
], TriviaQuestion);
//# sourceMappingURL=trivia-question.model.js.map