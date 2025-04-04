"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('constraint utility functions', () => {
    context('constrainFilter', () => {
        const inputFilter = filterBuilderHelper({
            fields: { a: true },
            where: { x: 'x' },
            limit: 5,
        });
        it('applies a where constraint', () => {
            const constraint = { id: '5' };
            const result = (0, __1.constrainFilter)(inputFilter, constraint);
            (0, testlab_1.expect)(result).to.containEql({
                where: Object.assign({}, inputFilter.where, constraint),
            });
        });
        it('applies a filter constraint with where object', () => {
            const constraint = { where: { id: '10' } };
            const result = (0, __1.constrainFilter)(inputFilter, constraint);
            (0, testlab_1.expect)(result).to.containEql({
                where: Object.assign({}, inputFilter.where, constraint.where),
            });
        });
        it('applies a filter constraint with duplicate key in where object', () => {
            const constraint = { where: { x: 'z' } };
            const result = (0, __1.constrainFilter)(inputFilter, constraint);
            (0, testlab_1.expect)(result).to.containEql({
                where: { and: [inputFilter.where, constraint.where] },
            });
        });
        it('does not apply filter constraint with unsupported fields', () => {
            const constraint = {
                fields: { b: false },
                where: { name: 'John' },
            };
            (0, testlab_1.expect)(() => {
                (0, __1.constrainFilter)(inputFilter, constraint);
            }).to.throw(/not implemented/);
        });
    });
    context('constrainWhere', () => {
        const inputWhere = {
            x: 'x',
            y: 'y',
        };
        it('enforces a constraint', () => {
            const constraint = { id: '5' };
            const result = (0, __1.constrainWhere)(inputWhere, constraint);
            (0, testlab_1.expect)(result).to.deepEqual(Object.assign({}, inputWhere, constraint));
        });
        it('enforces constraint with dup key', () => {
            const constraint = { y: 'z' };
            const result = (0, __1.constrainWhere)(inputWhere, constraint);
            (0, testlab_1.expect)(result).to.deepEqual({
                and: [inputWhere, constraint],
            });
        });
    });
    context('constrainWhereOr', () => {
        const inputWhere = {
            x: 'x',
        };
        it('enforces a constraint', () => {
            const constraint = [{ id: '5' }, { y: 'y' }];
            const result = (0, __1.constrainWhereOr)(inputWhere, constraint);
            (0, testlab_1.expect)(result).to.deepEqual({ ...inputWhere, or: constraint });
        });
        it('enforces constraint with dup key', () => {
            const constraint = [{ y: 'z' }, { x: 'z' }];
            const result = (0, __1.constrainWhereOr)(inputWhere, constraint);
            (0, testlab_1.expect)(result).to.deepEqual({ ...inputWhere, or: constraint });
        });
    });
    context('constrainDataObject', () => {
        it('constrains a single data object', () => {
            const input = new Order({ description: 'order 1' });
            const constraint = { id: 2 };
            (0, testlab_1.expect)((0, __1.constrainDataObject)(input, constraint)).to.containDeep({
                description: 'order 1',
                id: 2,
            });
        });
        it('throws error when the query changes field in constraint', () => {
            const input = new Order({ id: 1, description: 'order 1' });
            const constraint = { id: 2 };
            (0, testlab_1.expect)(() => {
                (0, __1.constrainDataObject)(input, constraint);
            }).to.throwError(/Property "id" cannot be changed!/);
        });
        it('allows constrained fields with the same values', () => {
            const input = new Order({ id: 2, description: 'order 1' });
            const constraint = { id: 2 };
            const result = (0, __1.constrainDataObject)(input, constraint);
            (0, testlab_1.expect)(result).to.deepEqual(new Order({
                id: 2,
                description: 'order 1',
            }));
        });
    });
    describe('constrainDataObjects', () => {
        it('constrains array of data objects', () => {
            const input = [
                new Order({ description: 'order 1' }),
                new Order({ description: 'order 2' }),
            ];
            const constraint = { id: 3 };
            const result = (0, __1.constrainDataObjects)(input, constraint);
            (0, testlab_1.expect)(result[0]).to.containDeep(Object.assign({}, input[0], constraint));
            (0, testlab_1.expect)(result[1]).to.containDeep(Object.assign({}, input[1], constraint));
        });
        it('throws error when the query changes field in constraint', () => {
            const input = [new Order({ id: 1, description: 'order 1' })];
            const constraint = { id: 2 };
            (0, testlab_1.expect)(() => {
                (0, __1.constrainDataObjects)(input, constraint);
            }).to.throwError(/Property "id" cannot be changed!/);
        });
        it('allows constrained fields with the same values', () => {
            const input = [new Order({ id: 2, description: 'order 1' })];
            const constraint = { id: 2 };
            const result = (0, __1.constrainDataObjects)(input, constraint);
            (0, testlab_1.expect)(result).to.deepEqual([
                new Order({
                    id: 2,
                    description: 'order 1',
                }),
            ]);
        });
    });
    /*---------------HELPERS----------------*/
    function filterBuilderHelper(filter) {
        const builder = new __1.FilterBuilder();
        for (const key in filter) {
            switch (key) {
                case 'fields':
                    builder.fields(filter[key]);
                    break;
                case 'where':
                    builder.where(filter[key]);
                    break;
                case 'limit':
                    builder.limit(filter[key]);
                    break;
                default:
                    throw Error('unsupported filter fields');
            }
        }
        return builder.build();
    }
    class Order extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
});
//# sourceMappingURL=constraint-utils.unit.js.map