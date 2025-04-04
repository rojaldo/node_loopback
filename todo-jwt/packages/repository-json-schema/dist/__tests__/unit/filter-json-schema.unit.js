"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository-json-schema
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const filter_json_schema_1 = require("../../filter-json-schema");
describe('getFilterJsonSchemaFor', () => {
    let ajv;
    let customerFilterSchema;
    let dynamicCustomerFilterSchema;
    let customerFilterExcludingWhereSchema;
    let customerFilterExcludingIncludeSchema;
    let orderFilterSchema;
    beforeEach(() => {
        ajv = new ajv_1.default();
        customerFilterSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Customer);
        dynamicCustomerFilterSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(DynamicCustomer);
        customerFilterExcludingWhereSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Customer, {
            exclude: ['where'],
        });
        customerFilterExcludingIncludeSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Customer, {
            exclude: ['include'],
        });
        orderFilterSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Order);
    });
    it('produces a valid schema', () => {
        const isValid = ajv.validateSchema(customerFilterSchema);
        const SUCCESS_MSG = 'Filter schema is a valid JSON Schema';
        const result = isValid ? SUCCESS_MSG : ajv.errorsText(ajv.errors);
        (0, testlab_1.expect)(result).to.equal(SUCCESS_MSG);
    });
    it('allows an empty filter', () => {
        expectSchemaToAllowFilter(customerFilterSchema, {});
    });
    it('allows a string-based order', () => {
        expectSchemaToAllowFilter(customerFilterSchema, { order: 'id DESC' });
    });
    it('allows a array-based order', () => {
        expectSchemaToAllowFilter(customerFilterSchema, { order: ['id DESC'] });
    });
    it('allows all top-level filter properties', () => {
        const filter = {
            where: { id: 1 },
            fields: { id: true, name: true },
            include: [{ relation: 'orders' }],
            offset: 0,
            limit: 10,
            order: ['id DESC'],
            skip: 0,
        };
        expectSchemaToAllowFilter(customerFilterSchema, filter);
    });
    it('disallows "where"', () => {
        var _a;
        const filter = { where: { name: 'John' } };
        ajv.validate(customerFilterExcludingWhereSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'additionalProperties',
                instancePath: '',
                schemaPath: '#/additionalProperties',
                params: { additionalProperty: 'where' },
                message: 'must NOT have additional properties',
            },
        ]);
    });
    it('disallows "include"', () => {
        var _a;
        const filter = { include: 'orders' };
        ajv.validate(customerFilterExcludingIncludeSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'additionalProperties',
                instancePath: '',
                schemaPath: '#/additionalProperties',
                params: { additionalProperty: 'include' },
                message: 'must NOT have additional properties',
            },
        ]);
    });
    it('describes "where" as an object', () => {
        var _a;
        const filter = { where: 'invalid-where' };
        ajv.validate(customerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                instancePath: '/where',
                message: 'must be object',
            },
        ]);
    });
    it('describes "fields" as an object', () => {
        var _a;
        const filter = { fields: 'invalid-fields' };
        ajv.validate(customerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                instancePath: '/fields',
                message: 'must be object',
            },
        ]);
    });
    it('allows free-form properties in "fields" for non-strict models"', () => {
        var _a;
        const filter = { fields: ['test', 'id'] };
        ajv.validate(dynamicCustomerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.be.empty();
    });
    it('allows only defined properties in "fields" for strict models"', () => {
        var _a;
        const filter = { fields: ['test'] };
        ajv.validate(customerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'enum',
                instancePath: '/fields/0',
                params: { allowedValues: ['id', 'name'] },
                message: 'must be equal to one of the allowed values',
            },
        ]);
    });
    it('rejects "fields" with duplicated items for strict models', () => {
        var _a;
        const filter = { fields: ['id', 'id'] };
        ajv.validate(customerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'uniqueItems',
                instancePath: '/fields',
                message: 'must NOT have duplicate items (items ## 1 and 0 are identical)',
            },
        ]);
    });
    it('rejects "fields" with duplicated items for non-strict models', () => {
        var _a;
        const filter = { fields: ['test', 'test'] };
        ajv.validate(dynamicCustomerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'uniqueItems',
                instancePath: '/fields',
                message: 'must NOT have duplicate items (items ## 1 and 0 are identical)',
            },
        ]);
    });
    it('describes "include" as an array for models with relations', () => {
        var _a;
        const filter = { include: 'invalid-include' };
        ajv.validate(customerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                instancePath: '/include',
                message: 'must be array',
            },
        ]);
    });
    it('leaves out "include" for models with no relations', () => {
        var _a;
        const filterProperties = Object.keys((_a = orderFilterSchema.properties) !== null && _a !== void 0 ? _a : {});
        (0, testlab_1.expect)(filterProperties).to.not.containEql('include');
    });
    it('describes "offset" as an integer', () => {
        var _a;
        const filter = { offset: 'invalid-offset' };
        ajv.validate(customerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                instancePath: '/offset',
                message: 'must be integer',
            },
        ]);
    });
    it('describes "limit" as an integer', () => {
        var _a;
        const filter = { limit: 'invalid-limit' };
        ajv.validate(customerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                instancePath: '/limit',
                message: 'must be integer',
            },
        ]);
    });
    it('describes "skip" as an integer', () => {
        var _a;
        const filter = { skip: 'invalid-skip' };
        ajv.validate(customerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                instancePath: '/skip',
                message: 'must be integer',
            },
        ]);
    });
    it('describes "order" as a string or array', () => {
        var _a;
        const filter = { order: { invalidOrder: '' } };
        ajv.validate(customerFilterSchema, filter);
        (0, testlab_1.expect)((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                instancePath: '/order',
                message: 'must be string',
            },
            {
                keyword: 'type',
                instancePath: '/order',
                message: 'must be array',
            },
            {
                keyword: 'oneOf',
                instancePath: '/order',
                params: { passingSchemas: null },
                message: 'must match exactly one schema in oneOf',
            },
        ]);
    });
    it('returns "title" when no options were provided', () => {
        (0, testlab_1.expect)(orderFilterSchema.title).to.equal('Order.Filter');
    });
    it('returns "include.title" when no options were provided', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'title')
            .to.equal('Customer.IncludeFilter');
    });
    it('enumerates relations under relation object', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'items', 'anyOf', '0', 'properties', 'relation', 'enum')
            .containDeep(['orders']);
    });
    it('returns "include.items.title" when no options were provided', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'items', 'anyOf', '0', 'title')
            .to.equal('Customer.IncludeFilter.Items');
    });
    it('returns "scope.title" when no options were provided', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'items', 'anyOf', '0', 'properties', 'scope', 'title')
            .to.equal('Customer.ScopeFilter');
    });
    function expectSchemaToAllowFilter(schema, value) {
        const isValid = ajv.validate(schema, value);
        const SUCCESS_MSG = 'Filter instance is valid according to Filter schema';
        const result = isValid ? SUCCESS_MSG : ajv.errorsText(ajv.errors);
        (0, testlab_1.expect)(result).to.equal(SUCCESS_MSG);
    }
});
describe('getFilterJsonSchemaFor - excluding where', () => {
    let customerFilterSchema;
    it('excludes "where" using string[]', () => {
        customerFilterSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Customer, {
            exclude: ['where'],
        });
        (0, testlab_1.expect)(customerFilterSchema.properties).to.not.have.property('where');
    });
    it('excludes "where" using string', () => {
        customerFilterSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Customer, {
            exclude: 'where',
        });
        (0, testlab_1.expect)(customerFilterSchema.properties).to.not.have.property('where');
    });
});
describe('getFilterJsonSchemaFor - excluding include', () => {
    let customerFilterSchema;
    it('excludes "include" using string[]', () => {
        customerFilterSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Customer, {
            exclude: ['include'],
        });
        (0, testlab_1.expect)(customerFilterSchema.properties).to.not.have.property('include');
    });
    it('excludes "include" using string', () => {
        customerFilterSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Customer, {
            exclude: 'include',
        });
        (0, testlab_1.expect)(customerFilterSchema.properties).to.not.have.property('include');
    });
});
describe('getFilterJsonSchemaForOptionsSetTitle', () => {
    let customerFilterSchema;
    beforeEach(() => {
        customerFilterSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Customer, { setTitle: true });
    });
    it('returns "title" when a single option "setTitle" is set', () => {
        (0, testlab_1.expect)(customerFilterSchema.title).to.equal('Customer.Filter');
    });
    it('returns "include.title" when a single option "setTitle" is set', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'title')
            .to.equal('Customer.IncludeFilter');
    });
    it('returns "include.items.title" when a single option "setTitle" is set', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'items', 'anyOf', '0', 'title')
            .to.equal('Customer.IncludeFilter.Items');
    });
    it('returns "scope.title" when a single option "setTitle" is set', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'items', 'anyOf', '0', 'properties', 'scope', 'title')
            .to.equal('Customer.ScopeFilter');
    });
});
describe('getFilterJsonSchemaForOptionsUnsetTitle', () => {
    let customerFilterSchema;
    beforeEach(() => {
        customerFilterSchema = (0, filter_json_schema_1.getFilterJsonSchemaFor)(Customer, { setTitle: false });
    });
    it('no title when a single option "setTitle" is false', () => {
        (0, testlab_1.expect)(customerFilterSchema).to.not.have.property('title');
    });
    it('no title on include when single option "setTitle" is false', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .property('include')
            .to.not.have.property('title');
    });
    it('no title on include.items when single option "setTitle" is false', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .propertyByPath('include', 'items', 'anyOf', '0')
            .to.not.have.property('title');
    });
    it('no title on scope when single option "setTitle" is false', () => {
        (0, testlab_1.expect)(customerFilterSchema.properties)
            .propertyByPath('include', 'items', 'anyOf', '0', 'properties', 'scope')
            .to.not.have.property('title');
    });
});
describe('getScopeFilterJsonSchemaFor - nested inclusion', () => {
    let todoListScopeSchema;
    let Todo = class Todo extends repository_1.Entity {
    };
    tslib_1.__decorate([
        (0, repository_1.property)({
            type: 'number',
            id: true,
            generated: false,
        }),
        tslib_1.__metadata("design:type", Number)
    ], Todo.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, repository_1.belongsTo)(() => TodoList),
        tslib_1.__metadata("design:type", Number)
    ], Todo.prototype, "todoListId", void 0);
    Todo = tslib_1.__decorate([
        (0, repository_1.model)()
    ], Todo);
    let TodoList = class TodoList extends repository_1.Entity {
    };
    tslib_1.__decorate([
        (0, repository_1.property)({
            type: 'number',
            id: true,
            generated: false,
        }),
        tslib_1.__metadata("design:type", Number)
    ], TodoList.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, repository_1.hasMany)(() => Todo),
        tslib_1.__metadata("design:type", Array)
    ], TodoList.prototype, "todos", void 0);
    TodoList = tslib_1.__decorate([
        (0, repository_1.model)()
    ], TodoList);
    beforeEach(() => {
        todoListScopeSchema = (0, filter_json_schema_1.getScopeFilterJsonSchemaFor)(TodoList, {
            setTitle: false,
        });
    });
    it('does not have constraint for scope filter', () => {
        (0, testlab_1.expect)(todoListScopeSchema.properties)
            .propertyByPath('include')
            .to.containEql({
            ...filter_json_schema_1.AnyScopeFilterSchema,
        });
    });
});
describe('getWhereJsonSchemaFor', () => {
    let ajv;
    let customerWhereSchema;
    beforeEach(() => {
        ajv = new ajv_1.default();
        customerWhereSchema = (0, filter_json_schema_1.getWhereJsonSchemaFor)(Customer);
    });
    it('produces a valid schema', () => {
        const isValid = ajv.validateSchema(customerWhereSchema);
        const SUCCESS_MSG = 'Where schema is a valid JSON Schema';
        const result = isValid ? SUCCESS_MSG : ajv.errorsText(ajv.errors);
        (0, testlab_1.expect)(result).to.equal(SUCCESS_MSG);
    });
    it('returns "title" when no options were provided', () => {
        (0, testlab_1.expect)(customerWhereSchema.title).to.equal('Customer.WhereFilter');
    });
});
describe('getWhereJsonSchemaForOptions', () => {
    let customerWhereSchema;
    it('returns "title" when a single option "setTitle" is set', () => {
        customerWhereSchema = (0, filter_json_schema_1.getWhereJsonSchemaFor)(Customer, {
            setTitle: true,
        });
        (0, testlab_1.expect)(customerWhereSchema.title).to.equal('Customer.WhereFilter');
    });
    it('leaves out "title" when a single option "setTitle" is false', () => {
        customerWhereSchema = (0, filter_json_schema_1.getWhereJsonSchemaFor)(Customer, {
            setTitle: false,
        });
        (0, testlab_1.expect)(customerWhereSchema).to.not.have.property('title');
    });
});
describe('getFieldsJsonSchemaFor', () => {
    let customerFieldsSchema;
    it('returns "title" when no options were provided', () => {
        customerFieldsSchema = (0, filter_json_schema_1.getFieldsJsonSchemaFor)(Customer);
        (0, testlab_1.expect)(customerFieldsSchema.title).to.equal('Customer.Fields');
    });
    it('returns "title" when a single option "setTitle" is set', () => {
        customerFieldsSchema = (0, filter_json_schema_1.getFieldsJsonSchemaFor)(Customer, {
            setTitle: true,
        });
        (0, testlab_1.expect)(customerFieldsSchema.title).to.equal('Customer.Fields');
    });
    it('leaves out "title" when a single option "setTitle" is false', () => {
        customerFieldsSchema = (0, filter_json_schema_1.getFieldsJsonSchemaFor)(Customer, {
            setTitle: false,
        });
        (0, testlab_1.expect)(customerFieldsSchema).to.not.have.property('title');
    });
});
describe('single option setTitle override original value', () => {
    let customerFieldsSchema;
    it('returns builtin "title" when no options were provided', () => {
        customerFieldsSchema = {
            title: 'Test Title',
            ...(0, filter_json_schema_1.getFieldsJsonSchemaFor)(Customer),
        };
        (0, testlab_1.expect)(customerFieldsSchema.title).to.equal('Customer.Fields');
    });
    it('returns builtin "title" when a single option "setTitle" is set', () => {
        customerFieldsSchema = {
            title: 'Test Title',
            ...(0, filter_json_schema_1.getFieldsJsonSchemaFor)(Customer, {
                setTitle: true,
            }),
        };
        (0, testlab_1.expect)(customerFieldsSchema.title).to.equal('Customer.Fields');
    });
    it('returns original "title" when a single option "setTitle" is false', () => {
        customerFieldsSchema = {
            title: 'Test Title',
            ...(0, filter_json_schema_1.getFieldsJsonSchemaFor)(Customer, {
                setTitle: false,
            }),
        };
        (0, testlab_1.expect)(customerFieldsSchema.title).to.equal('Test Title');
    });
});
let Order = class Order extends repository_1.Entity {
};
tslib_1.__decorate([
    (0, repository_1.property)({ id: true }),
    tslib_1.__metadata("design:type", Number)
], Order.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)(),
    tslib_1.__metadata("design:type", Number)
], Order.prototype, "customerId", void 0);
Order = tslib_1.__decorate([
    (0, repository_1.model)()
], Order);
let Customer = class Customer extends repository_1.Entity {
};
tslib_1.__decorate([
    (0, repository_1.property)({ id: true }),
    tslib_1.__metadata("design:type", Number)
], Customer.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)(),
    tslib_1.__metadata("design:type", String)
], Customer.prototype, "name", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => Order),
    tslib_1.__metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
Customer = tslib_1.__decorate([
    (0, repository_1.model)()
], Customer);
let DynamicCustomer = class DynamicCustomer extends repository_1.Entity {
};
DynamicCustomer = tslib_1.__decorate([
    (0, repository_1.model)({
        settings: { strict: false },
    })
], DynamicCustomer);
//# sourceMappingURL=filter-json-schema.unit.js.map