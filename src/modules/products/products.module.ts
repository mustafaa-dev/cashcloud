import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductRepository } from '@app/modules/products/repositories/product.repository';
import { DatabaseModule } from '@app/common';
import { Product } from '@app/modules/products/entities';
import { StoresModule } from '@app/stores';
import { MediaModule } from '@app/media';

@Module({
  imports: [
    DatabaseModule.forFeature([Product]),
    forwardRef(() => StoresModule),
    forwardRef(() => MediaModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
