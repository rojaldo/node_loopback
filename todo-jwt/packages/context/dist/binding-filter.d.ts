import { Binding, BindingTag } from './binding';
import { BindingAddress } from './binding-key';
import { MapObject } from './value-promise';
/**
 * A function that filters bindings. It returns `true` to select a given
 * binding.
 *
 * @remarks
 * Originally, we allowed filters to be tied with a single value type.
 * This actually does not make much sense - the filter function is typically
 * invoked on all bindings to find those ones matching the given criteria.
 * Filters must be prepared to handle bindings of any value type. We learned
 * about this problem after enabling TypeScript's `strictFunctionTypes` check.
 * This aspect is resolved by typing the input argument as `Binding<unknown>`.
 *
 * Ideally, `BindingFilter` should be declared as a type guard as follows:
 * ```ts
 * export type BindingFilterGuard<ValueType = unknown> = (
 *   binding: Readonly<Binding<unknown>>,
 * ) => binding is Readonly<Binding<ValueType>>;
 * ```
 *
 * But TypeScript treats the following types as incompatible and does not accept
 * type 1 for type 2.
 *
 * 1. `(binding: Readonly<Binding<unknown>>) => boolean`
 * 2. `(binding: Readonly<Binding<unknown>>) => binding is Readonly<Binding<ValueType>>`
 *
 * If we described BindingFilter as a type-guard, then all filter implementations
 * would have to be explicitly typed as type-guards too, which would make it
 * tedious to write quick filter functions like `b => b.key.startsWith('services')`.
 *
 * To keep things simple and easy to use, we use `boolean` as the return type
 * of a binding filter function.
 */
export interface BindingFilter {
    (binding: Readonly<Binding<unknown>>): boolean;
}
/**
 * Select binding(s) by key or a filter function
 */
export type BindingSelector<ValueType = unknown> = BindingAddress<ValueType> | BindingFilter;
/**
 * Type guard for binding address
 * @param bindingSelector - Binding key or filter function
 */
export declare function isBindingAddress(bindingSelector: BindingSelector): bindingSelector is BindingAddress;
/**
 * Binding filter function that holds a binding tag pattern. `Context.find()`
 * uses the `bindingTagPattern` to optimize the matching of bindings by tag to
 * avoid expensive check for all bindings.
 */
export interface BindingTagFilter extends BindingFilter {
    /**
     * A special property on the filter function to provide access to the binding
     * tag pattern which can be utilized to optimize the matching of bindings by
     * tag in a context.
     */
    bindingTagPattern: BindingTag | RegExp;
}
/**
 * Type guard for BindingTagFilter
 * @param filter - A BindingFilter function
 */
export declare function isBindingTagFilter(filter?: BindingFilter): filter is BindingTagFilter;
/**
 * A function to check if a given tag value is matched for `filterByTag`
 */
export interface TagValueMatcher {
    /**
     * Check if the given tag value matches the search criteria
     * @param tagValue - Tag value from the binding
     * @param tagName - Tag name
     * @param tagMap - Tag map from the binding
     */
    (tagValue: unknown, tagName: string, tagMap: MapObject<unknown>): boolean;
}
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
export declare const ANY_TAG_VALUE: TagValueMatcher;
/**
 * Create a tag value matcher function that returns `true` if the target tag
 * value equals to the item value or is an array that includes the item value.
 * @param itemValues - A list of tag item value
 */
export declare function includesTagValue(...itemValues: unknown[]): TagValueMatcher;
/**
 * Create a binding filter for the tag pattern
 * @param tagPattern - Binding tag name, regexp, or object
 */
export declare function filterByTag(tagPattern: BindingTag | RegExp): BindingTagFilter;
/**
 * Create a binding filter from key pattern
 * @param keyPattern - Binding key/wildcard, regexp, or a filter function
 */
export declare function filterByKey(keyPattern?: string | RegExp | BindingFilter): BindingFilter;
