"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByKey = exports.filterByTag = exports.includesTagValue = exports.ANY_TAG_VALUE = exports.isBindingTagFilter = exports.isBindingAddress = void 0;
/**
 * Check if an object is a `BindingKey` by duck typing
 * @param selector Binding selector
 */
function isBindingKey(selector) {
    if (selector == null || typeof selector !== 'object')
        return false;
    return (typeof selector.key === 'string' &&
        typeof selector.deepProperty === 'function');
}
/**
 * Type guard for binding address
 * @param bindingSelector - Binding key or filter function
 */
function isBindingAddress(bindingSelector) {
    return (typeof bindingSelector !== 'function' &&
        (typeof bindingSelector === 'string' ||
            // See https://github.com/loopbackio/loopback-next/issues/4570
            // `bindingSelector instanceof BindingKey` is not always reliable as the
            // `@loopback/context` module might be loaded from multiple locations if
            // `npm install` does not dedupe or there are mixed versions in the tree
            isBindingKey(bindingSelector)));
}
exports.isBindingAddress = isBindingAddress;
/**
 * Type guard for BindingTagFilter
 * @param filter - A BindingFilter function
 */
function isBindingTagFilter(filter) {
    if (filter == null || !('bindingTagPattern' in filter))
        return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tagPattern = filter.bindingTagPattern;
    return (tagPattern instanceof RegExp ||
        typeof tagPattern === 'string' ||
        typeof tagPattern === 'object');
}
exports.isBindingTagFilter = isBindingTagFilter;
/**
 * A symbol that can be used to match binding tags by name regardless of the
 * value.
 *
 * @example
 *
 * The following code matches bindings with tag `{controller: 'A'}` or
 * `{controller: 'controller'}`. But if the tag name 'controller' does not
 * exist for a binding, the binding will NOT be included.
 *
 * ```ts
 * ctx.findByTag({controller: ANY_TAG_VALUE})
 * ```
 */
const ANY_TAG_VALUE = (tagValue, tagName, tagMap) => tagName in tagMap;
exports.ANY_TAG_VALUE = ANY_TAG_VALUE;
/**
 * Create a tag value matcher function that returns `true` if the target tag
 * value equals to the item value or is an array that includes the item value.
 * @param itemValues - A list of tag item value
 */
function includesTagValue(...itemValues) {
    return tagValue => {
        return itemValues.some(itemValue => 
        // The tag value equals the item value
        tagValue === itemValue ||
            // The tag value contains the item value
            (Array.isArray(tagValue) && tagValue.includes(itemValue)));
    };
}
exports.includesTagValue = includesTagValue;
/**
 * Create a binding filter for the tag pattern
 * @param tagPattern - Binding tag name, regexp, or object
 */
function filterByTag(tagPattern) {
    let filter;
    let regex = undefined;
    if (tagPattern instanceof RegExp) {
        // RegExp for tag names
        regex = tagPattern;
    }
    if (typeof tagPattern === 'string' &&
        (tagPattern.includes('*') || tagPattern.includes('?'))) {
        // Wildcard tag name
        regex = wildcardToRegExp(tagPattern);
    }
    if (regex != null) {
        // RegExp or wildcard match
        filter = b => b.tagNames.some(t => regex.test(t));
    }
    else if (typeof tagPattern === 'string') {
        // Plain tag string match
        filter = b => b.tagNames.includes(tagPattern);
    }
    else {
        // Match tag name/value pairs
        const tagMap = tagPattern;
        filter = b => {
            for (const t in tagMap) {
                if (!matchTagValue(tagMap[t], t, b.tagMap))
                    return false;
            }
            // All tag name/value pairs match
            return true;
        };
    }
    // Set up binding tag for the filter
    const tagFilter = filter;
    tagFilter.bindingTagPattern = regex !== null && regex !== void 0 ? regex : tagPattern;
    return tagFilter;
}
exports.filterByTag = filterByTag;
function matchTagValue(tagValueOrMatcher, tagName, tagMap) {
    const tagValue = tagMap[tagName];
    if (tagValue === tagValueOrMatcher)
        return true;
    if (typeof tagValueOrMatcher === 'function') {
        return tagValueOrMatcher(tagValue, tagName, tagMap);
    }
    return false;
}
/**
 * Create a binding filter from key pattern
 * @param keyPattern - Binding key/wildcard, regexp, or a filter function
 */
function filterByKey(keyPattern) {
    if (typeof keyPattern === 'string') {
        const regex = wildcardToRegExp(keyPattern);
        return binding => regex.test(binding.key);
    }
    else if (keyPattern instanceof RegExp) {
        return binding => keyPattern.test(binding.key);
    }
    else if (typeof keyPattern === 'function') {
        return keyPattern;
    }
    return () => true;
}
exports.filterByKey = filterByKey;
/**
 * Convert a wildcard pattern to RegExp
 * @param pattern - A wildcard string with `*` and `?` as special characters.
 * - `*` matches zero or more characters except `.` and `:`
 * - `?` matches exactly one character except `.` and `:`
 */
function wildcardToRegExp(pattern) {
    // Escape reserved chars for RegExp:
    // `- \ ^ $ + . ( ) | { } [ ] :`
    let regexp = pattern.replace(/[\-\[\]\/\{\}\(\)\+\.\\\^\$\|\:]/g, '\\$&');
    // Replace wildcard chars `*` and `?`
    // `*` matches zero or more characters except `.` and `:`
    // `?` matches one character except `.` and `:`
    regexp = regexp.replace(/\*/g, '[^.:]*').replace(/\?/g, '[^.:]');
    return new RegExp(`^${regexp}$`);
}
//# sourceMappingURL=binding-filter.js.map