import { SetMetadata } from '@nestjs/common';

export const setPermissions = (permissions: string[]) =>
  SetMetadata('permissions', permissions);
