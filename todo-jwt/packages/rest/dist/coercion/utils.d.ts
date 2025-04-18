/**
 * Options for function coerceDatetime
 */
export type DateCoercionOptions = {
    dateOnly?: boolean;
};
/**
 * Options for function coerceInteger
 */
export type IntegerCoercionOptions = {
    isLong?: boolean;
};
export declare function isEmpty(data: string): boolean;
/**
 * A set of truthy values. A data in this set will be coerced to `true`.
 *
 * @param data - The raw data get from http request
 * @returns The corresponding coerced boolean type
 */
export declare function isTrue(data: string): boolean;
/**
 * A set of falsy values. A data in this set will be coerced to `false`.
 * @param data - The raw data get from http request
 * @returns The corresponding coerced boolean type
 */
export declare function isFalse(data: string): boolean;
/**
 * Return false for invalid date
 */
export declare function isValidDateTime(data: Date): boolean;
/**
 * Return true when a date follows the RFC3339 standard
 *
 * @param date - The date to verify
 */
export declare function matchDateFormat(date: string): boolean;
/**
 * Return the corresponding OpenAPI data type given an OpenAPI schema
 *
 * @param type - The type in an OpenAPI schema specification
 * @param format - The format in an OpenAPI schema specification
 */
export declare function getOAIPrimitiveType(type?: string, format?: string): "object" | "binary" | "boolean" | "string" | "number" | "integer" | "array" | "float" | "double" | "byte" | "date" | "date-time" | "password" | "long" | undefined;
