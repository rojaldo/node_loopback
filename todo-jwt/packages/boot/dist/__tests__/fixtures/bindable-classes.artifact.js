"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceWithMethodInject = exports.ServiceWithPropertyInject = exports.ServiceWithConstructorInject = exports.NotBindableDateProvider = exports.NotBindableGreetingService = exports.DateProvider = exports.BindableGreetingService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
let BindableGreetingService = class BindableGreetingService {
    greet(whom = 'world') {
        return Promise.resolve(`Hello ${whom}`);
    }
};
exports.BindableGreetingService = BindableGreetingService;
exports.BindableGreetingService = BindableGreetingService = tslib_1.__decorate([
    (0, core_1.injectable)({
        tags: { serviceType: 'local' },
        scope: core_1.BindingScope.SINGLETON,
    })
], BindableGreetingService);
let DateProvider = class DateProvider {
    value() {
        return Promise.resolve(new Date());
    }
};
exports.DateProvider = DateProvider;
exports.DateProvider = DateProvider = tslib_1.__decorate([
    (0, core_1.injectable)({ tags: { serviceType: 'local', name: 'CurrentDate' } })
], DateProvider);
class NotBindableGreetingService {
    greet(whom = 'world') {
        return Promise.resolve(`Hello ${whom}`);
    }
}
exports.NotBindableGreetingService = NotBindableGreetingService;
class NotBindableDateProvider {
    value() {
        return Promise.resolve(new Date());
    }
}
exports.NotBindableDateProvider = NotBindableDateProvider;
let ServiceWithConstructorInject = class ServiceWithConstructorInject {
    constructor(user) {
        this.user = user;
    }
};
exports.ServiceWithConstructorInject = ServiceWithConstructorInject;
exports.ServiceWithConstructorInject = ServiceWithConstructorInject = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('currentUser')),
    tslib_1.__metadata("design:paramtypes", [String])
], ServiceWithConstructorInject);
class ServiceWithPropertyInject {
}
exports.ServiceWithPropertyInject = ServiceWithPropertyInject;
tslib_1.__decorate([
    (0, core_1.inject)('currentUser'),
    tslib_1.__metadata("design:type", String)
], ServiceWithPropertyInject.prototype, "user", void 0);
class ServiceWithMethodInject {
    greet(user) {
        return `Hello, ${user}`;
    }
}
exports.ServiceWithMethodInject = ServiceWithMethodInject;
tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('currentUser')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ServiceWithMethodInject.prototype, "greet", null);
//# sourceMappingURL=bindable-classes.artifact.js.map