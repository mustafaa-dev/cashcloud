import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '@app/modules/products/products.service';
import { AddProductDto } from '@app/common/dtos/products/add-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import {
  CurrentUser,
  LoggedInUserInterface,
  setPermissions,
} from '@app/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get('/')
  async getProducts(@Paginate() query: PaginateQuery) {
    return await this.productService.getProducts(query);
  }

  @Get('/:id')
  async getProductById(@Param('id') id: number) {
    return await this.productService.getProductById(id);
  }

  @Post('/:storeId')
  @UseInterceptors(FileInterceptor('image'))
  @setPermissions(['add_any_product'])
  async addProduct(
    @Param('storeId') storeId: number,
    @Body() addProductDto: AddProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.productService.addProduct(storeId, addProductDto, image);
  }

  @Post('own/:storeId')
  @UseInterceptors(FileInterceptor('image'))
  @setPermissions(['add_own_product'])
  async addOwnProduct(
    @CurrentUser() user: LoggedInUserInterface,
    @Param('storeId') storeId: number,
    @Body() addProductDto: AddProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.productService.addProduct(storeId, addProductDto, image);
  }

  @Delete('/:id')
  @setPermissions(['delete_any_product'])
  async deleteProduct(@Param('id') id: number) {
    return await this.productService.deleteProduct(id);
  }
}
