import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '@app/modules/products/products.service';
import {
  AddProductDto,
  CurrentUser,
  LoggedInUserInterface,
  OwnerClient,
  OwnerClientTrigger,
  setPermissions,
} from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtGuard, PermissionGuard } from '@app/auth/guards';

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

  @Patch('own/:storeId/:productId')
  @setPermissions(['update_own_product'])
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateOwnProduct(
    @Param('storeId') storeId: number,
    @Param('productId') productId: number,
    @Body() updateProductDto: AddProductDto,
    @OwnerClient({ trigger: OwnerClientTrigger.S_P })
    status: boolean,
  ) {
    if (!status) throw new Error('You are not allowed to update this product');
    return await this.productService.updateProduct(productId, updateProductDto);
  }

  @Patch(':storeId/:productId')
  @setPermissions(['update_any_product'])
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('storeId') storeId: number,
    @Param('productId') productId: number,
    @Body() updateProductDto: AddProductDto,
    status: boolean,
  ) {
    if (!status) throw new Error('You are not allowed to update this product');
    return await this.productService.updateProduct(productId, updateProductDto);
  }
}
