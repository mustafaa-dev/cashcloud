import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@app/modules/products/repositories/product.repository';
import {
  AddProductDto,
  generateNumber,
  PRODUCTS_PAGINATION,
  UpdateProductDto,
} from '@app/common';
import { Product } from '@app/modules/products/entities';
import { StoresService } from '@app/stores/stores.service';
import { EntityManager } from 'typeorm';
import { MediaService } from '@app/media/media.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly storesService: StoresService,
    private readonly mediaService: MediaService,
    private readonly entityManager: EntityManager,
  ) {}

  async getProducts(query: PaginateQuery) {
    return paginate(
      query,
      this.productRepository.createQueryBuilder('products'),
      PRODUCTS_PAGINATION,
    );
  }

  async addProduct(
    storeId: number,
    addProductDto: AddProductDto,
    image: Express.Multer.File,
  ) {
    const newProduct = new Product();
    const store = await this.storesService.getStoreById(storeId);
    Object.assign(newProduct, addProductDto);

    return await this.entityManager.transaction(async (tr) => {
      if (image) {
        const photo = await this.mediaService.uploadPicture(image);
        newProduct.photo = await tr.save(photo);
      }
      newProduct.store = store;
      newProduct.code = addProductDto.code || (await generateNumber(14));
      // return newProduct;
      return await tr.save(newProduct);
    });
  }

  async getProductById(id: number) {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['photo', 'store'],
    });
  }

  async deleteProduct(id: number) {
    return await this.productRepository.findOneAndDelete({ id });
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    return await this.productRepository.findOneAndUpdate(
      { id },
      updateProductDto,
    );
  }

  async getProductsOfStore(storeId: number) {
    return await this.productRepository
      .createQueryBuilder('products')
      .where('products.storeId = :storeId', { storeId })
      .getMany();
  }
}
