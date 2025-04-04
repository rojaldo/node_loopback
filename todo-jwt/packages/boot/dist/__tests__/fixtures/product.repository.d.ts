import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Product } from './product.model';
export declare class ProductRepository extends DefaultCrudRepository<Product, typeof Product.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
