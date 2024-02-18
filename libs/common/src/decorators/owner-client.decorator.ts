import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  LoggedInUserInterface,
  OwnerClientInterface,
} from '@app/common/interfaces';
import { ProductsService } from '@app/modules/products/products.service';
import { Store } from '@app/stores/entities';

let productModule: ModuleRef;

export const setProductModuleRef = (ref: ModuleRef) => {
  productModule = ref;
};

const checkOwnerClient = async (
  context: ExecutionContext,
  data: OwnerClientInterface,
): Promise<boolean> => {
  const { user, params } = await getParamsAndUser(context);
  const { trigger } = data;
  if (!user.client_details && user.role.name === 'admin') return true;
  if (trigger === OwnerClientTrigger.S_P) {
    const license = user.client_details.license;
    const storeIds: number[] = await getStores(user);
    const storeProductsIds: number[] = await getProducts(params.storeId);
    if (
      license &&
      storeIds.includes(+params.storeId) &&
      storeProductsIds.includes(+params.productId)
    )
      return true;
  }

  throw new ForbiddenException('You are not allowed to update this product');
};

export const OwnerClient = createParamDecorator(
  (data: OwnerClientInterface, context: ExecutionContext) =>
    checkOwnerClient(context, data),
);

export enum OwnerClientTrigger {
  S_P = 'store&product',
}

async function getStores(user: LoggedInUserInterface) {
  return user.client_details.license.stores.map((store: Store) => store.id);
}

async function getProducts(id: number) {
  const productsService = productModule.get(ProductsService, { strict: false });
  const products = await productsService.getProductsOfStore(id);
  return products.map((product) => product.id);
}

async function getParamsAndUser(context: ExecutionContext) {
  return {
    user: context.switchToHttp().getRequest().user,
    params: context.switchToHttp().getRequest().params,
  };
}
