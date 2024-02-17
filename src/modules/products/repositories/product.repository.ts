import { AbstractRepository } from '@app/common';
import { Product } from '@app/modules/products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class ProductRepository extends AbstractRepository<Product> {
  constructor(
    @InjectRepository(Product) productRepository: Repository<Product>,
    entityManager: EntityManager,
  ) {
    super(productRepository, entityManager, 'Product Not Found !');
  }
}
