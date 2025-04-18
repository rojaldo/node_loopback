"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestHttpErrors = void 0;
const tslib_1 = require("tslib");
const http_errors_1 = tslib_1.__importDefault(require("http-errors"));
var RestHttpErrors;
(function (RestHttpErrors) {
    function invalidData(data, name, extraProperties) {
        const msg = `Invalid data ${JSON.stringify(data)} for parameter "${name}".`;
        return Object.assign(new http_errors_1.default.BadRequest(msg), {
            code: 'INVALID_PARAMETER_VALUE',
            parameterName: name,
        }, extraProperties);
    }
    RestHttpErrors.invalidData = invalidData;
    function unsupportedMediaType(contentType, allowedTypes = []) {
        const msg = (allowedTypes === null || allowedTypes === void 0 ? void 0 : allowedTypes.length)
            ? `Content-type ${contentType} does not match [${allowedTypes}].`
            : `Content-type ${contentType} is not supported.`;
        return Object.assign(new http_errors_1.default.UnsupportedMediaType(msg), {
            code: 'UNSUPPORTED_MEDIA_TYPE',
            contentType: contentType,
            allowedMediaTypes: allowedTypes,
        });
    }
    RestHttpErrors.unsupportedMediaType = unsupportedMediaType;
    function missingRequired(name) {
        const msg = `Required parameter ${name} is missing!`;
        return Object.assign(new http_errors_1.default.BadRequest(msg), {
            code: 'MISSING_REQUIRED_PARAMETER',
            parameterName: name,
        });
    }
    RestHttpErrors.missingRequired = missingRequired;
    function invalidParamLocation(location) {
        const msg = `Parameters with "in: ${location}" are not supported yet.`;
        return new http_errors_1.default.NotImplemented(msg);
    }
    RestHttpErrors.invalidParamLocation = invalidParamLocation;
    RestHttpErrors.INVALID_REQUEST_BODY_MESSAGE = 'The request body is invalid. See error object `details` property for more info.';
    function invalidRequestBody(details) {
        return Object.assign(new http_errors_1.default.UnprocessableEntity(RestHttpErrors.INVALID_REQUEST_BODY_MESSAGE), {
            code: 'VALIDATION_FAILED',
            details,
        });
    }
    RestHttpErrors.invalidRequestBody = invalidRequestBody;
})(RestHttpErrors || (exports.RestHttpErrors = RestHttpErrors = {}));
//# sourceMappingURL=rest-http-error.js.map