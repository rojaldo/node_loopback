import { AnyObject, Entity, EntityCrudRepository, Filter, InclusionFilter, Options } from '..';
/**
 * Finds model instances that contain any of the provided foreign key values.
 *
 * @param targetRepository - The target repository where the related model instances are found
 * @param fkName - Name of the foreign key
 * @param fkValues - One value or array of values of the foreign key to be included
 * @param scope - Additional scope constraints
 * @param options - Options for the operations
 */
export declare function findByForeignKeys<Target extends Entity, TargetRelations extends object, ForeignKey extends StringKeyOf<Target>>(targetRepository: EntityCrudRepository<Target, unknown, TargetRelations>, fkName: ForeignKey, fkValues: Target[ForeignKey][] | Target[ForeignKey], scope?: Filter<Target> & {
    totalLimit?: number;
}, options?: Options): Promise<(Target & TargetRelations)[]>;
export type StringKeyOf<T> = Extract<keyof T, string>;
/**
 * Returns model instances that include related models that have a registered
 * resolver.
 *
 * @param targetRepository - The target repository where the model instances are found
 * @param entities - An array of entity instances or data
 * @param include -Inclusion filter
 * @param options - Options for the operations
 */
export declare function includeRelatedModels<T extends Entity, Relations extends object = {}>(targetRepository: EntityCrudRepository<T, unknown, Relations>, entities: T[], include?: InclusionFilter[], options?: Options): Promise<(T & Relations)[]>;
/**
 * Returns an array of instances. The order of arrays is based on
 * the order of sourceIds
 *
 * @param sourceIds - One value or array of values of the target key
 * @param targetEntities - target entities that satisfy targetKey's value (ids).
 * @param targetKey - name of the target key
 *
 */
export declare function flattenTargetsOfOneToOneRelation<Target extends Entity>(sourceIds: unknown[], targetEntities: Target[], targetKey: StringKeyOf<Target>): (Target | undefined)[];
/**
 * Returns an array of instances. The order of arrays is based on
 * as a result of one to many relation. The order of arrays is based on
 * the order of sourceIds
 *
 * @param sourceIds - One value or array of values of the target key
 * @param targetEntities - target entities that satisfy targetKey's value (ids).
 * @param targetKey - name of the target key
 *
 */
export declare function flattenTargetsOfOneToManyRelation<Target extends Entity>(sourceIds: unknown[], targetEntities: Target[], targetKey: StringKeyOf<Target>): (Target[] | undefined)[];
/**
 * Returns an array of instances from the target map. The order of arrays is based on
 * the order of sourceIds
 *
 * @param sourceIds - One value or array of values (of the target key)
 * @param targetMap - a map that matches sourceIds with instances
 */
export declare function flattenMapByKeys<T>(sourceIds: unknown[], targetMap: Map<unknown, T>): (T | undefined)[];
/**
 * Returns a map which maps key values(ids) to instances. The instances can be
 * grouped by different strategies.
 *
 * @param list - an array of instances
 * @param keyName - key name of the source
 * @param reducer - a strategy to reduce inputs to single item or array
 */
export declare function buildLookupMap<Key, InType extends object, OutType = InType>(list: InType[], keyName: StringKeyOf<InType>, reducer: (accumulator: OutType | undefined, current: InType) => OutType): Map<Key, OutType>;
/**
 * Returns value of a keyName. Aims to resolve ObjectId problem of Mongo.
 *
 * @param model - target model
 * @param keyName - target key that gets the value from
 */
export declare function getKeyValue(model: AnyObject, keyName: string): unknown;
/**
 * Workaround for MongoDB, where the connector returns ObjectID
 * values even for properties configured with "type: string".
 *
 * @param rawKey
 */
export declare function normalizeKey(rawKey: unknown): unknown;
/**
 * Returns an array of instances. For HasMany relation usage.
 *
 * @param acc
 * @param it
 */
export declare function reduceAsArray<T>(acc: T[] | undefined, it: T): T[];
/**
 * Returns a single of an instance. For HasOne and BelongsTo relation usage.
 *
 * @param _acc
 * @param it
 */
export declare function reduceAsSingleItem<T>(_acc: T | undefined, it: T): T;
/**
 * Dedupe an array
 * @param input - an array of sourceIds
 * @returns an array with unique items
 */
export declare function deduplicate<T>(input: T[]): T[];
/**
 * Checks if the value is BsonType (mongodb)
 * It uses a general way to check the type ,so that it can detect
 * different versions of bson that might be used in the code base.
 * Might need to update in the future.
 *
 * @param value
 */
export declare function isBsonType(value: unknown): value is object;
